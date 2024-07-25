import { useState, useEffect } from "react";
import axios from "axios";
import AnimeDelayEpConfirmation from "./AnimeDelayEpConfirmation";
import RateAnime from "./RateAnime";
import "./AnimeAvailableDate.css"

// Displays div with classname
function displayDiv(divClassName, anime) {
    let parents = document.getElementsByClassName(divClassName+anime);
    for(let i = 0; i < parents.length; i++) {
        if (parents[i].style.display === 'none') {
            parents[i].style.display = 'block';
        } else {
            parents[i].style.display = 'none';
        }
    }

    parents = document.getElementsByClassName(anime);
    for(let i = 0; i < parents.length; i++) {
        if (parents[i].style.display === 'none') {
            parents[i].style.display = 'block';
        } else {
            parents[i].style.display = 'none';
        }
    }
}

// Updates the number of episodes watched on MyAnimeList
function updateStatus(anime, setRefreshAnimeDisplay) {

    // Display rating div if last episode
    if(anime.eps_watched === (anime.eps - 1) && anime.eps !== 0) {
        displayDiv('rating', anime.id);
    } else {
        let updateFeedback = document.getElementById(anime.id+"update-spinner");
        updateFeedback.style.display = "inline";

        let updateFeedback2 = document.getElementById(anime.id+'ep-details-div');
        updateFeedback2.style.display = "none";

        axios.post('/api/update-anime',
            {
                'anime-id': anime.id,
                'eps-watched': anime.eps_watched,
                'completed': false,
                'status': 'watching'
            }
        )
        .then(response => {
            anime.eps_watched++;
            setRefreshAnimeDisplay(prevFlag => !prevFlag);
            updateFeedback.style.display = "none";
            updateFeedback2.style.display = "flex";
        })
        .catch(error => {
            if(error.response.status === 502) {
                document.getElementById('popup-error-message').textContent = error.response.data;
                const popup = document.getElementById("error-popup");
                popup.classList.add("show-error");
                popup.classList.remove("hide-error");
                updateFeedback.style.display = "none";
                updateFeedback2.style.display = "flex";
            } else {
                axios.delete('/api/logout')
                .then(response => {
                    document.cookie = "username" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    document.cookie = "pfp" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

                    localStorage.setItem('errorMsgDiv', true);
                    document.cookie = 'session=; Max-Age=-99999999;';
                    window.location.href = response.data.redirect_url;
                });
            }
        });
    }
}

// Display episode status when there is no time available
const episodeStatusNoBroadcastTime = ((days, nextEpInfo, anime) => {
    if(days > 1) {
        // More than 1 day until available
        return(
            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span>{` is estimated to air in ${Math.ceil(days)} days on `}<span style={{color: "var(--text)", fontWeight: "bold"}}>{nextEpInfo[2]} {nextEpInfo[1]} {nextEpInfo[3]}, {nextEpInfo[0]}</span></p>
        );
    } else if(days < 0) {
        // Available
        return(
            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span> {` available to watch now`}</p>
        );
    } else {
        // Available today
        
        return(
            <p className="episode-status">
                <span style={{color: "var(--text)", fontWeight: "bold"}}>
                    Ep. {anime.eps_watched + 1}&nbsp;
                </span>
                should be available to watch&nbsp;
                <span style={{color: "var(--text)", fontWeight: "bold"}}>
                    today.
                </span>
            </p>
        );
    }
});

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

function AnimeAvailableDate({anime}) {
    const [refreshAnimeDisplay, setRefreshAnimeDisplay] = useState(false);

    // Progress Bar style
    let progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;
    let outerProgress = {
        width: "100%",
        backgroundColor: "#363636",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #666666",
    };

    let innerProgress = {
        height: "100%",
        width: `${String(Math.round(progress * 10) / 10) + "%"}`,
        background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
        borderRadius: "5px 0 0 5px"
    };

    if (anime.start_date === null) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <p className="episode-status">
                        No info on start date available
                    </p>
                    <div className="button-choice-div">
                            <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
                            <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                onClick={(event) => {
                                    clearTimeout(event.target.timeoutId);
                                    updateStatus(anime, setRefreshAnimeDisplay);
                                    document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                    event.target.style.display = "none";
                                }}>Confirm?</button>
                            <button id={anime.id+'show-watched-button'} className="positive-button" 
                                onClick={(event) => {
                                    event.target.style.display = "none";
                                    const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                    confirmButton.style.display = "block";

                                    const timeoutId = setTimeout(() => {
                                        confirmButton.style.display = "none";
                                        event.target.classList.add('bounce');
                                        event.target.style.display = "block";
                                    }, 3000);

                                    confirmButton.timeoutId = timeoutId;
                                }
                            }>Watched</button>
                        </div>
                </div>
            </>
        );
    }

    if(localStorage.getItem(anime.id) !== null) {
        anime.delayed_eps = Number(localStorage.getItem(anime.id));
    }

    let isoTime;
    if(anime.broadcast_time !== null) {
        // Get anime broadcast date and time
        // Then convert it to local time
        const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
        const jstDate = new Date(jstDateTimeStr);
        const localDateTimeStr = jstDate.toLocaleString();

        // Change into ISO 8601 format
        const [date, time] = localDateTimeStr.split(',');
        const [day,mth,yr] = date.trim().split('/');
        const [hour,min,sec] = time.trim().split(":");
        isoTime = `${yr}-${mth}-${day}T${hour}:${min}:${sec}`;
    }
    
    // Get next episode date
    let nextEpDate = new Date(isoTime);
    let daysToAdd = 7 * (anime.eps_watched + anime.delayed_eps);
    nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);
    
    // Gets days until next episode release
    const dateNow = Date.now();
    let diffMs = nextEpDate - dateNow;
    let days = diffMs / (1000 * 60 * 60 * 24);
    
    // Display information about next episode release
    let nextEpInfo = nextEpDate.toString().trim().split(' ');

    // Store the estimated end date if number of episodes is known
    if(anime.end_date === 0 && anime.eps) {
        let estEndDate = new Date(isoTime);
        const addDays = 7 * anime.eps;
        anime.end_date = estEndDate.setDate(estEndDate.getDate() + addDays);
    }

    // When user watches an episode, it will update
    useEffect(() => {
        anime.delayed_eps = Number(localStorage.getItem(anime.id));
        nextEpDate = new Date(isoTime);
        daysToAdd = 7 * (anime.eps_watched + anime.delayed_eps);
        nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);

        diffMs = nextEpDate - Date.now();
        days = diffMs / (1000 * 60 * 60 * 24);
        
        nextEpInfo = nextEpDate.toString().trim().split(' ');

        progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;
        innerProgress = {
            height: "100%",
            width: `${String(Math.round(progress * 10) / 10) + "%"}`,
            background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
            borderRadius: "5px 0 0 5px"
        };
        // setCountdown(diffMs);
    }, [refreshAnimeDisplay]);

    const [countdown, setCountdown] = useState(diffMs);

    useEffect(() => {
        if(countdown <= 0 || days > 1) return;

        const intervalId = setInterval(() => {
            setCountdown(c => c - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [countdown]);

    // If no information about time is available
    if(anime.broadcast_time === null && anime.start_date !== null) {
        let nextEpDate = new Date(anime.start_date);
        let daysToAdd = 7 * (anime.eps_watched + anime.delayed_eps);
        nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);

        const dateNow = Date.now();
        let diffMs = nextEpDate - dateNow;
        let days = diffMs / (1000 * 60 * 60 * 24);
        let nextEpInfo = nextEpDate.toString().trim().split(' ');

        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        {episodeStatusNoBroadcastTime(days, nextEpInfo, anime)}
                        <div className="button-choice-div">
                            <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                            <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                onClick={(event) => {
                                    clearTimeout(event.target.timeoutId);
                                    updateStatus(anime, setRefreshAnimeDisplay);
                                    document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                    event.target.style.display = "none";
                                }}>Confirm?</button>
                            <button id={anime.id+'show-watched-button'} className="positive-button" 
                                onClick={(event) => {
                                    event.target.style.display = "none";
                                    const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                    confirmButton.style.display = "block";

                                    const timeoutId = setTimeout(() => {
                                        confirmButton.style.display = "none";
                                        event.target.classList.add('bounce');
                                        event.target.style.display = "block";
                                    }, 3000);

                                    confirmButton.timeoutId = timeoutId;
                                }
                            }>Watched</button>
                        </div>
                    </div>
                    <AnimeDelayEpConfirmation anime={anime.id} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                </div>
            </>
        );
    }

    // If user completed the anime display completed until log back in
    if(anime.eps_watched === anime.eps && anime.eps_watched !== 0) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <p className="episode-status">
                        Completed
                    </p>
                </div>
            </>
        );
    }

    // Displays next episode status
    if(days > 1) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span>{` is estimated to air in ${Math.ceil(days)} days on `}<span style={{color: "var(--text)", fontWeight: "bold"}}>{nextEpInfo[2]} {nextEpInfo[1]} {nextEpInfo[3]}, {nextEpInfo[0]}</span></p>
                        <div className="button-choice-div">
                            <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                            <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                onClick={(event) => {
                                    clearTimeout(event.target.timeoutId);
                                    updateStatus(anime, setRefreshAnimeDisplay);
                                    document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                    event.target.style.display = "none";
                                }}>Confirm?</button>
                            <button id={anime.id+'show-watched-button'} className="positive-button" 
                                onClick={(event) => {
                                    event.target.style.display = "none";
                                    const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                    confirmButton.style.display = "block";

                                    const timeoutId = setTimeout(() => {
                                        confirmButton.style.display = "none";
                                        event.target.classList.add('bounce');
                                        event.target.style.display = "block";
                                    }, 3000);

                                    confirmButton.timeoutId = timeoutId;
                                }
                            }>Watched</button>
                        </div>
                    </div>
                    <AnimeDelayEpConfirmation anime={anime.id} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                </div>
            </>
        );
    // Countdown if within 24 hours
    } else if (days <= 1 && days >= 0) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    {countdown > 0 ? 
                    <>
                        <div className={anime.id}>
                            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span> is estimated to air in <span style={{color: "var(--text)", fontWeight: "bold"}}>{formatTime(countdown)}</span></p> 
                            <div className="button-choice-div">
                                <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                    onClick={(event) => {
                                        clearTimeout(event.target.timeoutId);
                                        updateStatus(anime, setRefreshAnimeDisplay);
                                        document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                        event.target.style.display = "none";
                                    }}>Confirm?</button>
                                <button id={anime.id+'show-watched-button'} className="positive-button" 
                                    onClick={(event) => {
                                        event.target.style.display = "none";
                                        const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                        confirmButton.style.display = "block";

                                        const timeoutId = setTimeout(() => {
                                            confirmButton.style.display = "none";
                                            event.target.classList.add('bounce');
                                            event.target.style.display = "block";
                                        }, 3000);

                                        confirmButton.timeoutId = timeoutId;
                                    }
                                }>Watched</button>
                            </div>
                        </div>
                        <AnimeDelayEpConfirmation anime={anime.id} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                    </>
                    :
                    <>
                        <div className={anime.id}>
                            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span> {` available to watch now`}</p>
                            <div className="button-choice-div">
                                <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                    onClick={(event) => {
                                        clearTimeout(event.target.timeoutId);
                                        updateStatus(anime, setRefreshAnimeDisplay);
                                        document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                        event.target.style.display = "none";
                                    }}>Confirm?</button>
                                <button id={anime.id+'show-watched-button'} className="positive-button" 
                                    onClick={(event) => {
                                        event.target.style.display = "none";
                                        const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                        confirmButton.style.display = "block";

                                        const timeoutId = setTimeout(() => {
                                            confirmButton.style.display = "none";
                                            event.target.classList.add('bounce');
                                            event.target.style.display = "block";
                                        }, 3000);

                                        confirmButton.timeoutId = timeoutId;
                                    }
                                }>Watched</button>
                            </div>
                        </div>
                        <AnimeDelayEpConfirmation anime={anime.id} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                        <RateAnime anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                    </>
                    }
                </div>
            </>
        );
    } else {
        let finishedAiring = (anime.air_status === 'finished_airing');

        return(
            <>  
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        {finishedAiring ?
                            <p className="episode-status"><span style={{color: "var(--text)"}}>All Eps. available to watch now</span></p>
                        :
                            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span>{` available to watch now`}</p>
                        }
                        <div className="button-choice-div">
                            {finishedAiring ?
                                <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
                                :
                                <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                            }
                            <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                onClick={(event) => {
                                    clearTimeout(event.target.timeoutId);
                                    updateStatus(anime, setRefreshAnimeDisplay);
                                    document.getElementById(anime.id+'show-watched-button').style.display = "block";
                                    event.target.style.display = "none";
                                }}>Confirm?</button>
                            <button id={anime.id+'show-watched-button'} className="positive-button" 
                                onClick={(event) => {
                                    event.target.style.display = "none";
                                    const confirmButton = document.getElementById(anime.id+'confirm-watched-button');
                                    confirmButton.style.display = "block";

                                    const timeoutId = setTimeout(() => {
                                        confirmButton.style.display = "none";
                                        event.target.classList.add('bounce');
                                        event.target.style.display = "block";
                                    }, 3000);

                                    confirmButton.timeoutId = timeoutId;
                                }
                            }>Watched</button>
                        </div>
                    </div>
                    <AnimeDelayEpConfirmation anime={anime.id} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                    <RateAnime anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                </div>
            </>
        );
    }
}

export default AnimeAvailableDate;