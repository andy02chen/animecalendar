import './NextEpisodeStatus.css';

function NextEpisodeStatus({anime, type}) {
    console.log(anime);
    if(type === 'ptw') {
        return(
            <p>PlaceHolder text for plan to watch</p>
        );
    } else if (type === 'cw') {
        
        // Cases
        // Available to watch now DONE
        // TODO Available within 24 hours 
        // Available > 24 hours DONE
        // TODO No broadcast time anime 
        // Finishing anime DONE

        // If Anime has finished airing
        if(anime.air_status === 'finished_airing') {
            return(
                <p className='next-episode-status-text'>All Eps. available to watch</p>
            );
        } else if (anime.air_status === "currently_airing") {
            // If anime if currently airing
            if(anime.daysTillRelease > 1) {
                const dateArr = anime.nextEpDate.toString().trim().split(' ');
                const airDate = dateArr[2];
                const airMonth = dateArr[1];
                const airYear = dateArr[3];
                const airDay = dateArr[0];

                return(
                    <p className='next-episode-status-text'>{`Ep. ${anime.displayProgress + 1} is estimated to air on ${airDay}, ${airDate} ${airMonth} ${airYear}`}</p>
                );

            } else if (anime.daysTillRelease > 0 && anime.daysTillRelease <= 1) {

            } else if (anime.daysTillRelease < 0) {
                return(
                    <p className='next-episode-status-text'>{`Ep. ${anime.displayProgress + 1} available to watch now`}</p>
                );
            }

            return(
                <p className='next-episode-status-text'>Error with estimated next anime episode. Please refresh or report an issue.</p>
            );
        }

        return(
            <p className='next-episode-status-text'>According to MAL data, this anime is not finished or currently airing. Check back again when it officially releases for episode information.</p>
        )
    }
    return(null);
}

export default NextEpisodeStatus;