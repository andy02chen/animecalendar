import './AnimeCard.css';
import {useState, useContext, useRef} from 'react';
import { AnimeContext } from '../Pages/CalendarPage';
import NextEpisodeStatus from './NextEpisodeStatus';

function increaseAnimeProgress(anime, setUpdate, setShowDelay) {
    anime.increaseProgress();
    setUpdate(u => !u);
    setShowDelay(false);

    if(anime.daysTillRelease > 0) {
        document.getElementById(anime.id+'earlyMsg').style.display = "inline";
    }

    if(anime.totalEpisodes > 0 && anime.currentProgress === anime.totalEpisodes) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = true;
    }
}

function decreaseAnimeProgress(anime, setUpdate, setShowDelay) {
    anime.decreaseProgress();
    setUpdate(u => !u);
    setShowDelay(false);

    if (anime.currentProgress === anime.minProgress || anime.currentProgress < anime.totalEpisodes) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = false;

        if(anime.currentProgress === anime.minProgress) {
            document.getElementById(anime.id+'earlyMsg').style.display = "none";
        }
    }
}

function setEarly(anime, setUpdate,weeksTillReleaseInt, setRefresh) {
    if(localStorage.getItem(anime.id+'early') === null) {
        localStorage.setItem(anime.id+'early',weeksTillReleaseInt);
    }
    anime.getNewEpsArray();
    setUpdate(u => !u);
    setRefresh(r => !u);
}

function updateAnimeProgress(anime, setUpdate, setLoading, setDisplayError, rating, setRefresh) {
    if(anime.currentProgress === anime.totalEpisodes && anime.air_status === 'finished_airing' && anime.totalEpisodes !== 0) {
        anime.markCompleted();
    }

    if(anime.daysTillRelease > 0) {
        if(localStorage.getItem(anime.id+'early') === null) {
            localStorage.setItem(anime.id+'early',anime.currentProgress - anime.minProgress);
        } else {
            localStorage.setItem(anime.id+'early',parseInt(localStorage.getItem(anime.id+'early'))+anime.currentProgress - anime.minProgress);
        }
    }

    anime.setRating(rating);
    setLoading(true);
    anime.updateWatchedEpisodes().then((result) => {
    if (result) {
        setUpdate(u => !u);
        anime.getNewEpsArray();
        setRefresh(r => !r);
    } else {
        localStorage.setItem('errorType', 'update_anime_error');
        setDisplayError(e => !e);
    }
    setLoading(false);
    });
}

function moveToWatchList(anime, addToWatching, setLoading, setUpdate, removeFromPlanToWatch, setDisplayError) {
    setLoading(true);
    anime.updateWatchedEpisodes().then((result) => {
    if (result) {
        setUpdate(u => !u);
        addToWatching(anime);
        removeFromPlanToWatch(anime.id);
    } else {
        localStorage.setItem('errorType', 'update_anime_error');
        setDisplayError(e => !e);
    }
    setLoading(false);
    });
}

// Delay the ep
function confirmDelay(anime, setShowDelay, delay, setDelay, setRefresh) {
    if(localStorage.getItem(anime.id) !== null) {
        const existingDictString = localStorage.getItem(anime.id);
        let myDict = existingDictString ? JSON.parse(existingDictString) : {};

        if(myDict[anime.currentProgress+1] === undefined) {
            myDict[anime.currentProgress+1] = delay;
        } else {
            myDict[anime.currentProgress+1] = myDict[anime.currentProgress+1]+ delay;
        }

        localStorage.setItem(anime.id, JSON.stringify(myDict));
    } else {
        const dict = {};
        dict[anime.currentProgress+1] = delay;
        localStorage.setItem(anime.id, JSON.stringify(dict));
    }
    anime.getNewEpsArray();
    setShowDelay(false);
    setDelay(1);
    setRefresh(r => !r);
}

function showDelayMessage(anime, setShowDelay, setDelay) {
    setDelay(1);
    setShowDelay(true);
    document.getElementById(anime.id+'earlyMsg').style.display = "none";
    anime.currentProgress = anime.minProgress;
}

function hideEarlyMessage(anime) {
    document.getElementById(anime+'mark-early-div').style.display = 'none';
}

function AnimeCard({anime, type}) {

    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setDisplayError, addToWatching, removeFromPlanToWatch, setRefresh } = useContext(AnimeContext);
    const [showDelay, setShowDelay] = useState(false);

    const [confirmStartedWatching, setConfirmStartedWatching] = useState(false);
    const timeoutRef = useRef(null);

    const [rating, setRating] = useState('0');
    const [delay, setDelay] = useState(1);

    const handleInput = (event) => {
        setRating(event.target.value);
    }

    // Delay Functions
    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value) || '';
        setDelay(newValue >= 1 ? newValue : 1);
    };

    const decreaseDelay = () => {
        setDelay((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
    }

    const increaseDelay = () => {
        setDelay((prevValue) => prevValue + 1);
    }
    
    // Progress Bar Styling
    let progress = anime.totalEpisodes === 0 ? 60: (anime.currentProgress / anime.totalEpisodes) * 100;

    let innerProgress = {
        height: "100%",
        width: `${String(Math.round(progress * 10) / 10) + "%"}`,
        background: "linear-gradient(to right, var(--accent), hsla(120, 100%, 39%, 0.95))",
        borderRadius: "5px 0 0 5px"
    };

    let outerProgress = {
        height: "1.5rem",
        width: "60%",
        backgroundColor: "#363636",
        borderRadius: "5px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #666666",
    };

    

    // Gets delayed eps if any
    let delaysThisWeek = 0;

    // Ceiling for weeklyAnime
    const weeklyAnimeCeiling = 8;

    if(anime.delayed_eps > 0) {
        const delayEpsDictString = localStorage.getItem(anime.id);
        let delayedEpsDict = delayEpsDictString ? JSON.parse(delayEpsDictString) : {};

        delaysThisWeek = delayedEpsDict[`${anime.currentProgress}`];
    }

    const weeksTillReleaseInt = Math.floor(Math.floor(anime.daysTillRelease) / 7);

    return(
        <div className='anime-card'>
            <div className='anime-card-header'>
                <h1 className='anime-card-title'>{anime.title}</h1>
                {anime.air_status === 'currently_airing' ?
                    <div className='anime-card-marker-color' style={{backgroundColor: `${localStorage.getItem(anime.id+'Colour')}`}}/>
                    :
                    null
                }
            </div>
            <div className='anime-progress-container'>
                <div className='card-image-div'>
                    <img src={anime.image} alt='Img of Anime'/>
                </div>
                <div className='card-progress-div'>
                    {type === "cw" && !loading && 
                        <>
                            <div className='anime-card-progress-buttons'>
                                <button className="anime-card-change-progress-button" id={`decrease-progress-${anime.id}`} disabled={anime.currentProgress <= anime.minProgress} 
                                onClick={() => decreaseAnimeProgress(anime, setUpdate, setShowDelay)}>-</button>
                                <p className='card-progress'>{anime.currentProgress}/{anime.totalEpisodes === 0 ? "?" : anime.totalEpisodes}</p>
                                <button className='anime-card-change-progress-button' id={`increase-progress-${anime.id}`} onClick={() => increaseAnimeProgress(anime, setUpdate, setShowDelay)}>+</button>
                            </div>
                            <div style={outerProgress}><div style={innerProgress}></div></div>
                            <div className='anime-card-status'>
                                <NextEpisodeStatus anime={anime} type={type}/>
                            </div>
                            {localStorage.getItem(anime.id+"early") === null ?
                                <p id={anime.id+'earlyMsg'} style={{display: 'none'}} className='early-message'>
                                    Are all episodes releasing <span className='status-highlight'>{anime.currentProgress - anime.minProgress} week(s)</span> early? Click 'Watched' to confirm
                                </p>
                                :
                                <p id={anime.id+'earlyMsg'} style={{display: 'none'}} className='early-message'>
                                    Episodes have already been confirmed to release 
                                    <span className='status-highlight'> {localStorage.getItem(anime.id+'early')} week(s)</span> early. Would you like to add another 
                                    <span className='status-highlight'> {anime.currentProgress - anime.minProgress} week(s)?</span>
                                </p>
                            }

                            {(anime.daysTillRelease > weeklyAnimeCeiling && localStorage.getItem(anime.id + 'Early') !== null) ?
                                <div className='mark-early-div' id={anime.id+'mark-early-div'}>
                                    <p className='mark-early-text'>The estimated release date for the next episode is over <span className='status-highlight'>{weeksTillReleaseInt} week(s)</span>. 
                                    Would you like to mark all episodes as releasing <span className='status-highlight'>{weeksTillReleaseInt} week(s)</span> early?</p>
                                    <div>
                                        <button className='mark-early-button negative-button' onClick={() => hideEarlyMessage(anime.id)}>No</button>
                                        <button className='mark-early-button positive-button' onClick={() => setEarly(anime,setUpdate, weeksTillReleaseInt, setRefresh)}>Yes</button>
                                    </div>
                                </div>
                                :
                                null
                            }
                            
                            {showDelay && (
                                <div className='delay-message'>
                                    <p>
                                        How many weeks will <span className='status-highlight'> Ep. {anime.currentProgress + 1} </span>be delayed?
                                    </p>
                                    <div className='delay-amount'>
                                        <button id="delay-decrease" onClick={() => decreaseDelay()}>◀</button>
                                        <input type="number" id="delayInput" value={delay}
                                        onChange={handleInputChange}
                                        min="1"/>
                                        <button id="delay-increase" onClick={() => increaseDelay()}>▶</button>
                                    </div>
                                </div>
                            )}
                            {anime.currentProgress === anime.totalEpisodes && !anime.completed ?
                                <div className='anime-card-rating'>
                                    <input
                                        style={{width: "80%"}}
                                        onChange={handleInput} 
                                        id="rating-slider" 
                                        type="range" 
                                        min="0" 
                                        max="10" 
                                        defaultValue={rating}
                                    />
                                    <p style={{fontSize: "1.5rem", color: "var(--white)", fontWeight: "700"}} id="rating-output">{rating === '0' ? `None` : rating}</p>
                                </div>
                                :
                                null
                            }
                            <div className='card-progress-buttons'>
                                {anime.air_status === 'finished_airing' ? 
                                    null
                                    :
                                    (showDelay ?
                                        <button className="card-progress-button positive-button" onClick={() => confirmDelay(anime, setShowDelay, delay, setDelay, setRefresh)}>
                                            Confirm
                                        </button>
                                        :
                                        <button className="card-progress-button negative-button" onClick={() => showDelayMessage(anime, setShowDelay, setDelay)}>
                                            Delayed
                                        </button>
                                    )
                                }
                                {anime.currentProgress === anime.minProgress || anime.completed?
                                    null
                                    :
                                    <button className="card-progress-button positive-button"
                                    onClick={() => updateAnimeProgress(anime, setUpdate, setLoading, setDisplayError, rating, setRefresh)}>
                                        Watched
                                    </button>
                                }
                                
                            </div>
                        </>
                    }
                    {type === "ptw" && !loading && 
                        <>
                            <div className='anime-card-status'>
                                <NextEpisodeStatus anime={anime} type={type}/>
                            </div>
                            {anime.air_status === 'currently_airing' || anime.air_status === 'finished_airing' ?
                                (confirmStartedWatching ?
                                    <button id={anime.id+'confirm-started-watching'} className='positive-button card-progress-button ptw-button'
                                    onClick={() => {
                                        clearTimeout(timeoutRef.current);
                                        moveToWatchList(anime, addToWatching, setLoading, setUpdate, removeFromPlanToWatch, setDisplayError);
                                    }}>
                                        Confirm
                                    </button>
                                    :
                                    <button className='positive-button card-progress-button ptw-button'
                                    onClick={() => {
                                        setConfirmStartedWatching(true);

                                        if (timeoutRef.current) {
                                            clearTimeout(timeoutRef.current);
                                        }

                                        timeoutRef.current = setTimeout(() => {
                                            setConfirmStartedWatching(false);
                                        }, 3000);
                                    }}>
                                        Started Watching
                                    </button>
                                )
                                :
                                null
                            }
                        </>
                    }
                    {loading && 
                        (
                            <div className='loading-container-update-anime'>
                                <svg className='loading-update-anime' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                                </svg>
                                <p className='loading-update-anime-text'>Loading...</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AnimeCard;