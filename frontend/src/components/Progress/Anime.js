import axios from 'axios';

export default class Anime {
    constructor(id, title, totalEpisodes, currentProgress, air_status, broadcast_time, delayed_eps, end_date, image, start_date) {
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
        this.epsArray = this.getEpsArray();

        if(this.air_status === 'currently_airing') {
            this.startCountDown();
        }
    }

    startCountDown() {
        this.countdownInterval = setInterval(() => {
            this.countdown -= 1000;

            if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
            }
        }, 1000);
    }

    getDelayedEps() {
        if(localStorage.getItem(this.id) !== null) {
            return Object.keys(JSON.parse(localStorage.getItem(this.id))).length;
        }

        return 0;
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

        if (this.totalEpisodes !== 0) {
            // Calculates estimated release dates for all episodes
            for(let i = 0; i < this.totalEpisodes; i++) {
                const epDate = new Date(isoTime);
                const delaysThisWeek = delayedEpsDict[`${i}`];
                let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                delaysToAdd = delaysToAdd + addToTotalDelays;
                epDate.setDate(epDate.getDate() + (7 * (i + delaysToAdd)));
                epsArray.push(epDate.toISOString());
            }
        } else {
            // Calculates the user's next ep is total is unknown
            for(let i = 0; i < this.currentProgress + 1; i++) {
                const epDate = new Date(isoTime);
                const delaysThisWeek = delayedEpsDict[`${i}`];
                let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                delaysToAdd = delaysToAdd + addToTotalDelays;
                epDate.setDate(epDate.getDate() + (7 * (i + delaysToAdd)));
                epsArray.push(epDate.toISOString());
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
    // TODO when complete anime
    // TODO when move from plan to watch to watching
    async updateWatchedEpisodes() {
        try {
            const response = await axios.post('/api/update-anime',
                {
                    'anime-id': this.id,
                    'eps-watched': this.currentProgress,
                    'completed': false,
                    'status': 'watching'
                });
            
            if(response.status === 200) {
                this.minProgress = this.currentProgress;
                this.displayProgress = this.currentProgress;
                this.epsArray = this.getEpsArray();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}