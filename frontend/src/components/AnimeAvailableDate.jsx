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
                'completed': false
            }
        )
        .then(response => {
            anime.eps_watched++;
            setRefreshAnimeDisplay(prevFlag => !prevFlag);
            updateFeedback.style.display = "none";
            updateFeedback2.style.display = "flex";
        })
        .catch(error => {
            //TODO pop up message for error
            if(error.response.status === 502) {
                console.log('bruh');
            } else {
                axios.delete('/api/logout')
                .then(response => {
                    document.cookie = 'session=; Max-Age=-99999999;';
                    alert(error.response.data);
                    window.location.href = response.data.redirect_url;
                });
            }
        });
    }
}

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

    if(localStorage.getItem(anime.id) !== null) {
        anime.delayed_eps = Number(localStorage.getItem(anime.id));
    }

    // Get anime broadcast date and time
    // Then convert it to local time
    const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
    const jstDate = new Date(jstDateTimeStr);
    const localDateTimeStr = jstDate.toLocaleString();

    // Change into ISO 8601 format
    const [date, time] = localDateTimeStr.split(',');
    const [day,mth,yr] = date.trim().split('/');
    const [hour,min,sec] = time.trim().split(":");
    const isoTime = `${yr}-${mth}-${day}T${hour}:${min}:${sec}`;
    
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
        anime.end_date = estEndDate.setDate(estEndDate.getDate() + daysToAdd);
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
    }, [refreshAnimeDisplay]);

    const [countdown, setCountdown] = useState(diffMs);

    useEffect(() => {
        if(countdown <= 0) return;

        const intervalId = setInterval(() => {
            setCountdown(c => c - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [countdown]);

    // Progress Bar style
    let progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;
    let outerProgress = {
        height: "30px",
        width: "100%",
        backgroundColor: "#363636",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
        border: "2px solid #666666",
    };

    let innerProgress = {
        height: "100%",
        width: `${String(Math.round(progress * 10) / 10) + "%"}`,
        background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
        borderRadius: "5px 0 0 5px"
    };

    // If user completed the anime display completed until log back in
    if(anime.eps_watched === anime.eps) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div style={outerProgress}><div style={innerProgress}></div></div>
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
    if(days >= 1) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <p className="episode-status">{`Ep. ${anime.eps_watched + 1} will be available in ${Math.ceil(days)} days on ${nextEpInfo[0]}, ${nextEpInfo.splice(1,3).join(' ')}`}</p>
                </div>
            </>
        );
    // Countdown if within 24 hours
    } else if (days < 1 && days >= 0) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    {countdown > 0 ? 
                    <p className="episode-status">Ep. {anime.eps_watched + 1} will be available to watch in <span style={{color: "var(--secondary)", fontWeight: "bold"}}>{formatTime(countdown)}</span></p> :
                    <>
                        <div className={anime.id}>
                            <p>{`Ep. ${anime.eps_watched + 1} available to watch now`}</p>
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
        let displayDelay = true;
        if(anime.end_date !== null) {
            const animeEndDateCompare = new Date(anime.end_date);
            const dateNow = Date.now();
            if(animeEndDateCompare < dateNow) {
                displayDelay = false;
            }
        }

        return(
            <>  
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        <p className="episode-status">{`Ep. ${anime.eps_watched + 1} available to watch now`}</p>
                        <div className="button-choice-div">
                            {displayDelay ?
                                <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                :
                                <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
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