import './NextEpisodeStatus.css';
import { useState, useEffect } from 'react';

// Formats the time into HH:MM:SS
function formatTime(timeRemaining) {
    let hours = Math.floor(timeRemaining / (1000*60*60));
    let mins = Math.floor(timeRemaining / (1000*60) % 60);
    let sec = Math.floor(timeRemaining / (1000) % 60);
    hours = String(hours).padStart(2, '0')
    mins = String(mins).padStart(2, '0')
    sec = String(sec).padStart(2, '0')
    return `${hours >= 1 ? hours+":" : ""}${mins >= 1 || hours >= 0 ? mins+":" : ""}${sec}`;
}

function NextEpisodeStatus({anime, type}) {
    
    const [countdown, setCountdown] = useState(anime.countdown);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown(c => {
                if (c <= 0) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return c - 1000;
            });
        }, 1000);
    
        return () => clearInterval(countdownInterval);
    }, [anime.countdown]);
    

    if(type === 'ptw') {
        return(
            <p>PlaceHolder text for plan to watch</p>
        );
    } else if (type === 'cw') {
        
        // Cases
        // TODO No broadcast time anime 

        if(anime.completed) {
            return(
                <p className='next-episode-status-text'>Completed 🎉</p>
            );
        }

        // If Anime has finished airing
        if(anime.air_status === 'finished_airing') {
            return(
                <p className='next-episode-status-text'><span className='status-highlight'>All Eps.</span> available to watch</p>
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
                    <p className='next-episode-status-text'>
                        <span className='status-highlight'>Ep. {anime.displayProgress + 1}</span>{` is estimated to air in ${Math.ceil(anime.daysTillRelease)} days on ${airDay}, ${airDate} ${airMonth} ${airYear}`}
                    </p>
                );

            } else if (anime.daysTillRelease > 0 && anime.daysTillRelease <= 1) {
                // Anime does not broadcast
                if(anime.broadcast_time === null) {
                    return(
                        <p className='next-episode-status-text'>This anime does not have an airing time.<br/>
                            <span className='status-highlight'>Ep. {anime.displayProgress + 1} </span>
                            will be available to watch 
                            <span className='status-highlight'> within 24 hours.</span>
                        </p>
                    );
                }

                if(countdown > 0) {
                    return(
                        <p className='next-episode-status-text'><span className='status-highlight'>Ep. {anime.displayProgress + 1}</span>{` is estimated to air in ${formatTime(countdown)}`}</p>
                    );
                }

                return(
                    <p className='next-episode-status-text'>
                        <span className='status-highlight'>Ep. {anime.displayProgress + 1}</span> available to <span className='status-highlight'>watch now</span>
                        </p>
                );

            } else if (anime.daysTillRelease < 0) {
                return(
                    <p className='next-episode-status-text'>
                        <span className='status-highlight'>Ep. {anime.displayProgress + 1}</span> available to <span className='status-highlight'>watch now</span>
                    </p>
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