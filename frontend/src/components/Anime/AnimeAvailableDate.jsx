import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import AnimeDelayEpConfirmation from "./AnimeDelayEpConfirmation";
import RateAnime from "./RateAnime";
import "./AnimeAvailableDate.css"
import { MyContext } from "../Pages/HomePage";

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
function updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents) {

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
            setRefreshAnimeDisplay(c => c + 1);
            setRenderAllComponents(c => c + 1);
            updateFeedback.style.display = "none";
            updateFeedback2.style.display = "flex";
        })
        .catch(error => {
            if(error.response.status === 502 || error.response.status === 400) {
                document.getElementById('popup-error-message').textContent = error.response.data;
                const popup = document.getElementById("error-popup");
                popup.classList.add("show-error");
                popup.classList.remove("hide-error");
                updateFeedback.style.display = "none";
                updateFeedback2.style.display = "flex";
            } else {
                axios.delete('/api/logout')
                .then(response => {
                    document.cookie = "username" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure; path=/';
                    document.cookie = "pfp" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure; path=/';

                    localStorage.setItem('errorMsgDiv', true);
                    document.cookie = 'session=; Max-Age=-99999999; SameSite=Lax; Secure; path=/';
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
    } else if(days <= 0) {
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
                should be available to watch within&nbsp;
                <span style={{color: "var(--text)", fontWeight: "bold"}}>
                    24 hours.
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

function AnimeAvailableDate({anime, handleData, setRenderAllComponents}) {
    const [refreshAnimeDisplay, setRefreshAnimeDisplay] = useState(0);

    // Timer for anime that are about air
    const [countdown, setCountdown] = useState(null);

    const userContext = useContext(MyContext);

    const days = useRef(null);
    const nextEpInfo = useRef(null);
    const nextEpDate = useRef(null);
    const [daysTillRelease, setDaysTillRelease] = useState(null);
    const recalculateDates = useRef(refreshAnimeDisplay);

    let endDateKnown = false;
    let progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;
    let innerProgress = {
        height: "100%",
        width: `${String(Math.round(progress * 10) / 10) + "%"}`,
        background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
        borderRadius: "5px 0 0 5px"
    };;
    let outerProgress = {
        width: "100%",
        backgroundColor: "#363636",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #666666",
    };

    let [possiblyInvalidAnime, setPossiblyInvalidAnime] = useState(false);
    let [animeNoBroadcastTime, setAnimeNoBroadcastTime] = useState(false);

    useEffect(() => {
        if(anime.start_date === null) {
            setPossiblyInvalidAnime(true);
            return;
        }

        // Get delay episode length to offset calculation
        if(localStorage.getItem(anime.id) !== null) {
            anime.delayed_eps = Object.keys(JSON.parse(localStorage.getItem(anime.id))).length;
        }

        // If anime has a broadcast time get it for calculations
        let isoTime;
        if(anime.broadcast_time !== null) {
            // Get anime broadcast date and time then convert it to local time
            const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
            const jstDate = new Date(jstDateTimeStr);
            isoTime = jstDate.toISOString();

        } else {

            setAnimeNoBroadcastTime(true);
            
            // Default to 12am
            const defaultTime = "23:59:59";
            const dateTimeStr = `${anime.start_date}T${defaultTime}`;
            const newDate = new Date(dateTimeStr);
            isoTime = newDate.toISOString();
        }

        // TODO maybe store these in localStorage the first time the user loads the page
            // Do not need to continue to calculate this afterwards
            // store in local first time -> get last date -> calculate and compare with next week ep
            // if not match recalculate and store, if match do nothing
        // TODO maybe case when there are a lot of episodes for case like One Piece
        // TODO make a way for the user to only display the dates from the past year, month, or no limit

        // Gets the anime episode dates and stores them in an array
        const epsArray = [];
        const delayEpsDictString = localStorage.getItem(anime.id);
        let delayedEpsDict = delayEpsDictString ? JSON.parse(delayEpsDictString) : {};
        const today = new Date();

        const theStartingDate = isoTime;
        let delaysToAdd = 0;

        // TODO probably an issue here
        // If anime has no broadcast time
        // within 24 hours (user watched the timer tick down) (highly unlikely the cause)
        // anime is finished airing or the timer is less than 0
        if((anime.eps_array.length === 0 || recalculateDates.current !== refreshAnimeDisplay) && anime.air_status === 'currently_airing') {
            recalculateDates.current = refreshAnimeDisplay;
            if (anime.eps) {
                // Calculates estimated release dates for all episodes
                for(let i = 0; i < anime.eps; i++) {
                    const epDate = new Date(theStartingDate);
                    const delaysThisWeek = delayedEpsDict[`${i}`];
                    let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                    delaysToAdd = delaysToAdd + addToTotalDelays;
                    epDate.setDate(epDate.getDate() + (7 * (i + delaysToAdd)));
                    epsArray.push(epDate);
                }
            }
            // When dont know number of eps
            else {
                // Calculates the next episode for the user
                let weeksToCalculate = 1;
                for(let i = 0; i < anime.eps_watched + weeksToCalculate; i++) {
                    const epDate = new Date(theStartingDate);
                    const delaysThisWeek = delayedEpsDict[`${i}`];
                    let addToTotalDelays = delaysThisWeek === undefined ? 0 : delaysThisWeek;
                    delaysToAdd = delaysToAdd + addToTotalDelays;
                    epDate.setDate(epDate.getDate() + (7 * (i + delaysToAdd)));
                    epsArray.push(epDate);

                    // If the user is not up to date, the next episode should not be the user's next episode but rather next week episode.
                    if(epDate < today && i === (anime.eps_watched)) {
                        weeksToCalculate++;
                    }
                }
            }

            anime.eps_array = epsArray;
            
        }

        // Get next episode date
        nextEpDate.current = anime.eps_array[anime.eps_watched];
        
        // Gets days until next episode release
        let diffMs = nextEpDate.current - Date.now();
        days.current = diffMs / (1000 * 60 * 60 * 24);
        setDaysTillRelease(days.current);
        setCountdown(diffMs);
        
        // Display information about next episode release
        if(nextEpDate.current) {
            nextEpInfo.current = nextEpDate.current.toString().trim().split(' ');
        }

        // Set Progress bar styling
        progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;
        innerProgress = {
            height: "100%",
            width: `${String(Math.round(progress * 10) / 10) + "%"}`,
            background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
            borderRadius: "5px 0 0 5px"
        };

        handleData(anime);
    }, [refreshAnimeDisplay]);

    useEffect(() => {
        // Stops countdown if finished or over 1 day
        if(countdown <= 0 || countdown > 86400000) {
            return;
        }

        const intervalId = setInterval(() => {
            setCountdown(c => c - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [countdown]);

    // User has completed the anime
    if(anime.eps === anime.eps_watched) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <p className="episode-status">
                    <span style={{color: "var(--text)", fontWeight: "bold"}}>Completed 🎉</span>
                    </p>
                </div>
            </>
        );
    }

    // TODO button to allow user to move back to plan to watch
    // Anime is not yet airing
    if(possiblyInvalidAnime) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <p className="episode-status">
                        No info on start date available. Are you sure this anime is airing?
                    </p>
                </div>
            </>
        );
    }

    // Anime Does not have a broadcast time
    if(animeNoBroadcastTime) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        {episodeStatusNoBroadcastTime(days.current, nextEpInfo.current, anime)}
                        {userContext === 'Guest' ?
                            null
                            :
                            <div className="button-choice-div">
                                <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                    onClick={(event) => {
                                        clearTimeout(event.target.timeoutId);
                                        updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents);
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
                        }
                    </div>
                    <AnimeDelayEpConfirmation anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv} nextEpDate={nextEpDate.current} setRenderAllComponents={setRenderAllComponents}/>
                </div>
            </>
        );
    }

    // Display depending on how many days till release
    if(daysTillRelease > 1) {
        return(
            <>
                <div className="progress-bar-text-div">
                    <p className="progress-bar-text">{anime.eps_watched} / {anime.eps === 0 ? '?' : anime.eps} ep</p>
                    <div className="bar-itself" style={outerProgress}><div style={innerProgress}></div></div>
                </div>
                <div className="progress-info-div">
                    <div className={anime.id}>
                        <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span>{` is estimated to air in ${Math.ceil(daysTillRelease)} days on `}<span style={{color: "var(--text)", fontWeight: "bold"}}>{nextEpInfo.current[2]} {nextEpInfo.current[1]} {nextEpInfo.current[3]}, {nextEpInfo.current[0]}</span></p>
                        {userContext === "Guest" ?
                            null
                            :
                            <div className="button-choice-div">
                                {endDateKnown ?
                                    <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
                                    :
                                    <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                }
                                <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                    onClick={(event) => {
                                        clearTimeout(event.target.timeoutId);
                                        updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents);
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
                        }
                    </div>
                    <AnimeDelayEpConfirmation anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv} nextEpDate={nextEpDate.current} setRenderAllComponents={setRenderAllComponents}/>
                </div>
            </>
        );
    // Countdown if within 24 hours
    } else if (daysTillRelease <= 1 && daysTillRelease >= 0) {
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
                            {userContext === "Guest" ?
                                null
                                :
                                <div className="button-choice-div">
                                    {endDateKnown ?
                                        <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
                                        :
                                        <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                    }
                                    <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                        onClick={(event) => {
                                            clearTimeout(event.target.timeoutId);
                                            updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents);
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
                            }
                        </div>
                        <AnimeDelayEpConfirmation anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv} nextEpDate={nextEpDate.current} setRenderAllComponents={setRenderAllComponents}/>
                    </>
                    :
                    <>
                        <div className={anime.id}>
                            <p className="episode-status"><span style={{color: "var(--text)", fontWeight: "bold"}}>Ep. {anime.eps_watched + 1}</span> {` available to watch now`}</p>
                            {userContext === "Guest" ?
                                null
                                :
                                <div className="button-choice-div">
                                    <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                    <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                        onClick={(event) => {
                                            clearTimeout(event.target.timeoutId);
                                            updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents);
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
                            }
                        </div>
                        <AnimeDelayEpConfirmation anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv} nextEpDate={nextEpDate.current} setRenderAllComponents={setRenderAllComponents}/>
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
                        {userContext === "Guest" ?
                            null
                            :
                            <div className="button-choice-div">
                                {finishedAiring ?
                                    <button style={{cursor:"not-allowed"}} className="negative-button" onClick={() => {displayDiv('delay', anime.id)}} disabled>Delayed</button>
                                    :
                                    <button className="negative-button" onClick={() => {displayDiv('delay', anime.id)}}>Delayed</button>
                                }
                                <button id={anime.id+'confirm-watched-button'} style={{display: "none"}} className="positive-button"
                                    onClick={(event) => {
                                        clearTimeout(event.target.timeoutId);
                                        updateStatus(anime, setRefreshAnimeDisplay, setRenderAllComponents);
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
                        }
                    </div>
                    <AnimeDelayEpConfirmation anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv} nextEpDate={nextEpDate.current} setRenderAllComponents={setRenderAllComponents}/>
                    <RateAnime anime={anime} setRefreshAnimeDisplay={setRefreshAnimeDisplay} displayDiv={displayDiv}/>
                </div>
            </>
        );
    }
}

export default AnimeAvailableDate;