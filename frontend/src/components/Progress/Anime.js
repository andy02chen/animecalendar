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
    }
}