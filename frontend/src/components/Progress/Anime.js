import axios from 'axios';

export default class Anime {
    constructor(id, title, totalEpisodes, currentProgress, air_status, broadcast_time, delayed_eps, end_date, image, start_date, season) {
        this.id = id;
        this.title = title;
        this.currentProgress = currentProgress;
        this.displayProgress = currentProgress;
        this.totalEpisodes = totalEpisodes;
        this.air_status = air_status;
        this.broadcast_time = broadcast_time;
        this.delayed_eps = this.getDelayedEps();
        this.start_date = start_date;
        this.end_date = end_date;
        this.image = image;
        this.minProgress = currentProgress;
        this.completed = false;
        this.countdown = null;
        this.rating = null;
        this.epsArray = this.getEpsArray();
        this.season = season;
        this.marker_colour = this.assignAnimeColour();
        

        if(this.air_status === 'finished_airing') {
            this.removeOutdatedLocalStorageData();
        }
    }

    changeColour(color) {
        localStorage.setItem(this.id+"Colour", color);
        this.marker_colour = color;
    }

    generateRandomColour() {
        const minBrightness = 100; // Minimum brightness for RGB values (0-255)
    
        // Generate RGB values ensuring they are above the minimum brightness
        const r = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
        const g = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
        const b = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;

        // Convert RGB to Hex
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        
        return hex;
    }
    
    // Assigns a colour to anime if necessary
    assignAnimeColour() {
        if(this.air_status === 'currently_airing') {
            if(localStorage.getItem(this.id+"Colour") === null) {
                const color = this.generateRandomColour();
                localStorage.setItem(this.id+"Colour", color);
                return color;
            }
            return localStorage.getItem(this.id+"Colour");
        } else if (this.air_status === 'finished_airing') {
            // Removes the colour marker if anime is no longer airing
            localStorage.removeItem(this.id+"Colour");
    
            // Removes any delayed eps
            localStorage.removeItem(this.id);
        }
        return null;
    }

    markCompleted() {
        this.completed = true;
    }

    setRating(rating) {
        this.rating = rating;
    }

    getDelayedEps() {
        if(localStorage.getItem(this.id) !== null) {
            return Object.keys(JSON.parse(localStorage.getItem(this.id))).length;
        }

        return 0;
    }

    removeOutdatedLocalStorageData() {
        if(localStorage.getItem(this.id+"Colour")) {
            localStorage.removeItem(this.id+"Colour");
        }

        if(localStorage.getItem(this.id+"Early")) {
            localStorage.removeItem(this.id+"Early");
        }

        if(localStorage.getItem(this.id)) {
            localStorage.removeItem(this.id);
        }
    }

    getNewEpsArray() {
        this.epsArray = this.getEpsArray();
    }

    getEpsArray() {
        if(this.air_status === 'finished_airing' || this.air_status === 'not_yet_aired') {
            return [];
        }

        let isoTime = null;

        if(this.broadcast_time !== null) {
            // Get anime broadcast date and time then convert it to local time
            const jstDateTimeStr = `${this.start_date}T${this.broadcast_time}:00+09:00`;
            const jstDate = new Date(jstDateTimeStr);
            isoTime = jstDate.toISOString();

        } else {
            // Default to 12am
            const defaultTime = "23:59:59";
            const dateTimeStr = `${this.start_date}T${defaultTime}`;
            const newDate = new Date(dateTimeStr);
            isoTime = newDate.toISOString();
        }

        // Calculates the episode dates and stores them
        const epsArray = [];
        const delayEpsDictString = localStorage.getItem(this.id);
        let delayedEpsDict = delayEpsDictString ? JSON.parse(delayEpsDictString) : {};
        let delaysToAdd = 0;

        // Gets number of weeks early
        let earlyValue = 0;
        if(localStorage.getItem(this.id + 'early') !== null) {
            earlyValue = parseInt(localStorage.getItem(this.id + 'early'));
        }

        if (this.totalEpisodes !== 0) {
            // Calculates estimated release dates for all episodes
            let epCounter = 0
            for(let i = 0; i < this.totalEpisodes; i++) {
                const epDate = new Date(isoTime);

                if(epCounter !== earlyValue) {
                    epsArray.push(epDate.toISOString());
                    epCounter += 1
                } else {
                    const delaysThisWeek = delayedEpsDict[`${i+1}`];
                    let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                    delaysToAdd = delaysToAdd + addToTotalDelays;

                    epDate.setDate(epDate.getDate() + (7 * ((i - earlyValue) + delaysToAdd)));
                    epsArray.push(epDate.toISOString());
                }
            }
        } else {
            // Calculates the user's next ep is total is unknown
            let epCounter = 0
            for(let i = 0; i < this.currentProgress + 1; i++) {
                const epDate = new Date(isoTime);

                
                if(epCounter !== earlyValue) {
                    epsArray.push(epDate.toISOString());
                    epCounter += 1
                } else {
                    const delaysThisWeek = delayedEpsDict[`${i+1}`];
                    let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                    delaysToAdd = delaysToAdd + addToTotalDelays;

                    epDate.setDate(epDate.getDate() + (7 * ((i - earlyValue) + delaysToAdd)));
                    epsArray.push(epDate.toISOString());
                }
            }
        }

        this.nextEpDate = new Date(epsArray[this.currentProgress]);
        const now = new Date();
        
        // Gets days until next episode release
        this.countdown = this.nextEpDate - now;
        this.daysTillRelease = this.countdown / (1000 * 60 * 60 * 24);

        return epsArray;
    }

    // Increase the episode count
    increaseProgress() {
        if (this.currentProgress < this.totalEpisodes || this.totalEpisodes === 0) {
            this.currentProgress += 1;
        }
    }

    //Decrease Progress
    decreaseProgress() {
        if(this.currentProgress > this.minProgress) {
            this.currentProgress -= 1;
        }
    }

    // Update watched progress
    // TODO when move from plan to watch to watching
    async updateWatchedEpisodes() {
        try {
            let response = null;

            if(this.completed) {

                let data = {}
                if(this.rating === 0) {
                    data = {
                        'anime-id': this.id,
                        'eps-watched': this.currentProgress,
                        'completed': true
                    }
                } else {
                    data = {
                        'anime-id': this.id,
                        'eps-watched': this.currentProgress,
                        'score': this.rating,
                        'completed': true
                    }
                }

                response = await axios.post('/api/update-anime', data);
            } else {
                response = await axios.post('/api/update-anime',
                    {
                        'anime-id': this.id,
                        'eps-watched': this.currentProgress,
                        'completed': false,
                        'status': 'watching'
                    });
            }
            
            if(response.status === 200) {
                this.minProgress = this.currentProgress;
                this.displayProgress = this.currentProgress;

                if(this.currentProgress === this.totalEpisodes) {
                    this.completed;
                }

                this.epsArray = this.getEpsArray();
                return true;
            }
            
            this.completed = false;
            return false;
        } catch (error) {
            this.completed = false;
            return false;
        }
    }
}