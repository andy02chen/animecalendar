import axios from 'axios';

export default class Anime {
    constructor(id, title, totalEpisodes, currentProgress, air_status, broadcast_time, delayed_eps, end_date, image, start_date) {
        this.id = id;
        this.title = title;
        this.currentProgress = currentProgress;
        this.totalEpisodes = totalEpisodes;
        this.air_status = air_status;
        this.broadcast_time = broadcast_time;
        this.delayed_eps = delayed_eps;
        this.start_date = start_date;
        this.end_date = end_date;
        this.image = image;
        this.minProgress = currentProgress;
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
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}