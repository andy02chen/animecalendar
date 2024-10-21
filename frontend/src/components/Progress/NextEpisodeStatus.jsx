import './NextEpisodeStatus.css';
import { useState, useEffect } from 'react';
import CountDown from '../Anime/Countdown';

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
                if (c <= 0 || c >= 86400000) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return c - 1000;
            });
        }, 1000);
    
        return () => clearInterval(countdownInterval);
    }, [anime.countdown]);
    

    if(type === 'ptw') {
        const monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // If anime has finished airing
        if(anime.air_status === 'finished_airing') {
            return(
                <div className='ptw-info-div'>
                    <h1 className='ptw-season-year'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</h1>
                    <p className='next-episode-status-text'>
                        This anime has <span className='status-highlight'>finished</span> airing.
                    </p>
                </div>
            );
        } else if(anime.air_status === 'currently_airing') {
            // Anime is currently airing
            return(
                <div className='ptw-info-div'>
                    <h1 className='ptw-season-year'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</h1>
                    <p className='next-episode-status-text'>
                        This anime is <span className='status-highlight'>currently</span> airing.
                    </p>
                </div>
            );
        } else if(anime.air_status === 'not_yet_aired') {
            // Anime not yet aired
            const start_date = anime.start_date;

            if(start_date) {
                const arr = start_date.split('-');

                console.log(arr);

                // Only year known
                if(arr.length === 1) {
                    const year = arr[0];

                    return(
                        <div className='ptw-info-div'>
                            <h1 className='ptw-season-year'>
                                {anime.season !== null ?
                                    <>
                                        {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                    </>
                                    :
                                    <>
                                        TBD
                                    </>
                                }</h1>
                            <p className='next-episode-status-text'>
                                This anime is set to release sometime in<span className='status-highlight'> {year}</span>.
                            </p>
                        </div>
                    );
                }
                // Only Year and month known
                else if (arr.length === 2) {
                    const year = arr[0];
                    const month = arr[1];

                    return(
                        <div className='ptw-info-div'>
                            <h1 className='ptw-season-year'>
                                {anime.season !== null ?
                                    <>
                                        {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                    </>
                                    :
                                    <>
                                        TBD
                                    </>
                                }
                            </h1>
                            <p className='next-episode-status-text'>
                                This anime is set to release sometime in <span className='status-highlight'>{monthString[month-1]} {year}</span>.
                            </p>
                        </div>
                    );
                }
                // Entire date is known
                else if (arr.length === 3) {
                    let isoTime = null;

                    if(anime.broadcast_time !== null) {
                        // Get anime broadcast date and time then convert it to local time
                        const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
                        const jstDate = new Date(jstDateTimeStr);
                        isoTime = jstDate.toISOString();
                    } else {
                        // Default to 12am
                        const defaultTime = "23:59:59";
                        const dateTimeStr = `${anime.start_date}T${defaultTime}`;
                        const newDate = new Date(dateTimeStr);
                        isoTime = newDate.toISOString();
                    }

                    const startDate = new Date(isoTime);
                    const dateNow = Date.now();
                    let diff = startDate - dateNow;
                    let days = Math.round(diff / (1000 * 60 * 60 * 24));
                    let startDateArr = startDate.toString().trim().split(' ');

                    console.log(days, diff);

                    if(diff < 0) {
                            return(
                                <div className='ptw-info-div'>
                                    <h1 className='ptw-season-year'>
                                        {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                    </h1>
                                    <p className='next-episode-status-text'>
                                        This anime will air <span className='status-highlight'> soon</span>.
                                    </p>
                                </div>
                            );
                        }

                    if(days > 1) {
                        return(
                            <div className='ptw-info-div'>
                                <h1 className='ptw-season-year'>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </h1>
                                <p className='next-episode-status-text'>
                                    This anime is estimated to air in&nbsp;
                                    <span className='status-highlight'>{days}</span>
                                    &nbsp;days on&nbsp;
                                    <span className='status-highlight'>{startDateArr[0]}, {startDateArr[2]} {startDateArr[1]} {startDateArr[3]} </span>
                                </p>
                            </div>
                        );
                    } else if(days >= 0 && days <= 1) {
                        return(
                            <div className='ptw-info-div'>
                                <h1 className='ptw-season-year'>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </h1>
                                <p className='next-episode-status-text'>
                                    This anime is estimated to air
                                    <span className='status-highlight'>
                                        <CountDown timer={diff}/>
                                    </span>.
                                </p>
                            </div>
                        );
                    } 
                }
            }

            // If no start date
            return(
                <div className='ptw-info-div'>
                    <h1 className='ptw-season-year'>
                    {anime.season !== null ?
                        <>
                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                        </>
                        :
                        <>
                            TBD
                        </>
                    }
                    </h1>
                    <p className='next-episode-status-text'>
                        Release info is unknown.
                    </p>
                </div>
            );
        }

        return(
            <div className='ptw-info-div'>
                <h1 className='ptw-season-year'>N/A</h1>
                <p className='next-episode-status-text'>There is no information available for this anime</p>
            </div>
        );
    } else if (type === 'cw') {
        
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