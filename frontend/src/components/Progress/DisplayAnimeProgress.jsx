import './DisplayAnimeProgress.css';
import { useEffect, useContext, useState } from 'react';
import AnimeCard from './AnimeCard';
import React from 'react';
import { AnimeContext } from '../Pages/CalendarPage';
import axios from 'axios';
import Anime from './Anime';

// Changes the Displayed anime list
function changeDisplayedList(list, setListSelected, selected) {
    if(list !== selected) {
        document.getElementById(`change-list-button-${list}`).classList.add('active-list');
        document.getElementById(`${selected}-anime-filters`).classList.add('hide');
        
        const list2 = document.getElementById('progress-display-anime-list');
        list2.classList.add('change');

        setTimeout(() => {
            document.getElementById(`change-list-button-${selected}`).classList.remove('active-list');
            setListSelected(list);
            list2.classList.remove('change');
        }, 500);
    }
}

// Tries to get user's lists again
function retryGetAnimeLists(handleSuccess, setError, setLoaded) {
    setError(false);
    setLoaded(false);
    // Get users watch list
    axios.get('/api/get-weekly-anime')
    .then(response => {
        const storeAnime = response.data.anime;
        const animeList = [];

        for (let animeData of storeAnime) {
            assignAnimeColour(animeData);
            animeList.push(
                new Anime(animeData.id, animeData.title, animeData.eps, animeData.eps_watched, animeData.air_status, 
                    animeData.broadcast_time, animeData.delayed_eps, animeData.end_date, animeData.img, animeData. start_date, null)
            );
        }

        // Get user's plan to watch list
        axios.get('/api/get-plan-to-watch')
        .then(response => {
            const storePlanToWatch = response.data.plan_to_watch;
            const ptwList = [];

            for (let animePlanned of storePlanToWatch) {
                ptwList.push(
                    new Anime(
                        animePlanned.id, animePlanned.title, 0, 0, animePlanned.air_status, animePlanned.broadcast_time, 0, null, animePlanned.img, animePlanned.start_date, animePlanned.season
                    )
                )
            }

            handleSuccess(animeList, ptwList);
            setLoaded(true);
        })
        .catch(planToWatchError => {
            setLoaded(true);
            setError(true);
        });
    })
    .catch (animeError => {
        setLoaded(true);
        setError(true);
    });
}

// Displays current watching anime list
function displayCurrWatchingAnimeList(animeArray, error, handleSuccess, setError, setLoaded, cwFilter) {
    if(error) {
        return (
            <div className='anime-card-error'>
                <h1 className='no-anime-cards-title'>There was an error getting your anime lists.</h1>
                <button className='retry-get-anime-lists' onClick={() => retryGetAnimeLists(handleSuccess, setError, setLoaded)}>Try again</button>
            </div>
        );
    }

    if(animeArray.length === 0) {
        return (
            <div className='anime-card-error'>
                <h1 className='no-anime-cards-title'>You do not have any anime in your <a href={`https://myanimelist.net/animelist/${localStorage.getItem('username')}`} target="_blank">Currently Watching</a> list.</h1>
            </div>
        );
    }

    if(cwFilter === 'curr_airing') {
        const newArr = [];
        for(let anime of animeArray) {
            if(anime.air_status === 'currently_airing') {
                newArr.push(anime);
            }
        }

        if(newArr.length === 0) {
            return (
                <div className='anime-card-error'>
                    <h1 className='no-anime-cards-title'>No anime found for the selected filter</h1>
                </div>
            );
        }

        return (
            <>
                {newArr.map((anime, index) => (
                    <React.Fragment key={anime.id} >
                        <AnimeCard anime={anime} type={'cw'} />
                        {index !== newArr.length - 1 && <div className='anime-card-divider'></div>}
                    </React.Fragment>
                ))}
            </>
        );
    } else if (cwFilter === 'fin_airing') {
        const newArr = [];
        for(let anime of animeArray) {
            if(anime.air_status === 'finished_airing') {
                newArr.push(anime);
            }
        }

        if(newArr.length === 0) {
            return (
                <div className='anime-card-error'>
                    <h1 className='no-anime-cards-title'>No anime found for the selected filter</h1>
                </div>
            );
        }

        return (
            <>
                {newArr.map((anime, index) => (
                    <React.Fragment key={anime.id} >
                        <AnimeCard anime={anime} type={'cw'} />
                        {index !== newArr.length - 1 && <div className='anime-card-divider'></div>}
                    </React.Fragment>
                ))}
            </>
        );
    }

    return (
        <>
            {animeArray.map((anime, index) => (
                <React.Fragment key={anime.id} >
                    <AnimeCard anime={anime} type={'cw'} />
                    {index !== animeArray.length - 1 && <div className='anime-card-divider'></div>}
                </React.Fragment>
            ))}
        </>
    );
}

// Displays plan to watch list
function displayPlanToWatchList(planToWatchArray, error, handleSuccess, setError, setLoaded, ptwFilter) {
    if(error) {
        return (
            <div className='anime-card-error'>
                <h1 className='no-anime-cards-title'>There was an error getting your anime lists.</h1>
                <button className='retry-get-anime-lists' onClick={() => retryGetAnimeLists(handleSuccess, setError, setLoaded)}>Try again</button>
            </div>
        );
    }

    if(planToWatchArray.length === 0) {
        return (
            <div className='anime-card-error'>
                <h1 className='no-anime-cards-title'>You do not have any anime in your <a href={`https://myanimelist.net/animelist/${localStorage.getItem('username')}`} target="_blank">Plan To Watch</a> list.</h1>
            </div>
        );
    }

    if(ptwFilter === 'fin_only') {
        const newArr = [];

        for(let anime of planToWatchArray) {
            if(anime.air_status === 'finished_airing') {
                newArr.push(anime);
            }
        }

        if(newArr.length === 0) {
            return (
                <div className='anime-card-error'>
                    <h1 className='no-anime-cards-title'>No anime found for the selected filter.</h1>
                </div>
            );
        }

        return (
            <>
                {newArr.map((anime, index) => (
                    <React.Fragment key={anime.id} >
                        <AnimeCard anime={anime} type={'ptw'}/>
                        {index !== newArr.length - 1 && <div className='anime-card-divider'></div>}
                    </React.Fragment>
                ))}
            </>
        );

    } else if (ptwFilter === 'curr_not_yet_airing') {
        const newArr = [];

        for(let anime of planToWatchArray) {
            if(anime.air_status === 'not_yet_aired' || anime.air_status === "currently_airing") {
                newArr.push(anime);
            }
        }

        if(newArr.length === 0) {
            return (
                <div className='anime-card-error'>
                    <h1 className='no-anime-cards-title'>No anime found for the selected filter.</h1>
                </div>
            );
        }

        return (
            <>
                {newArr.map((anime, index) => (
                    <React.Fragment key={anime.id} >
                        <AnimeCard anime={anime} type={'ptw'}/>
                        {index !== newArr.length - 1 && <div className='anime-card-divider'></div>}
                    </React.Fragment>
                ))}
            </>
        );
    }

    return (
        <>
            {planToWatchArray.map((anime, index) => (
                <React.Fragment key={anime.id} >
                    <AnimeCard anime={anime} type={'ptw'}/>
                    {index !== planToWatchArray.length - 1 && <div className='anime-card-divider'></div>}
                </React.Fragment>
            ))}
        </>
    );
}

function generateRandomColour() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.round(Math.random() * 30 * 10)/10;
    const lightness = 50 + Math.round(Math.random() * 30 * 10)/10;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Assigns a colour to anime if necessary
function assignAnimeColour(animeData) {
    if(animeData.air_status === 'currently_airing') {
        localStorage.setItem(animeData.id+"Colour", generateRandomColour());
    } else if (animeData.air_status === 'finished_airing') {
        // Removes the colour marker if anime is no longer airing
        localStorage.removeItem(animeData.id+"Colour");

        // Removes any delayed eps
        localStorage.removeItem(animeData.id);
    }
}

// Gets user's anime lists
function getUsersAnime(handleSuccess, setLoaded, setError) {
    // Get users watch list
    axios.get('/api/get-weekly-anime')
    .then(response => {
        const storeAnime = response.data.anime;
        const animeList = [];

        for (let animeData of storeAnime) {
            assignAnimeColour(animeData);
            animeList.push(
                new Anime(animeData.id, animeData.title, animeData.eps, animeData.eps_watched, animeData.air_status, 
                    animeData.broadcast_time, animeData.delayed_eps, animeData.end_date, animeData.img, animeData. start_date, null)
            );
        }

        // Get user's plan to watch list
        axios.get('/api/get-plan-to-watch')
        .then(response => {
            const storePlanToWatch = response.data.plan_to_watch;
            const ptwList = [];

            for (let animePlanned of storePlanToWatch) {
                ptwList.push(
                    new Anime(
                        animePlanned.id, animePlanned.title, 0, 0, animePlanned.air_status, animePlanned.broadcast_time, 0, null, animePlanned.img, animePlanned.start_date, animePlanned.season
                    )
                )
            }

            handleSuccess(animeList, ptwList);
            setLoaded(true);
        })
        .catch(planToWatchError => {
            setLoaded(true);
            setError(true);
        });
    })
    .catch (animeError => {
        setLoaded(true);
        setError(true);
    });
}

function DisplayAnimeProgress() {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {handleSuccess, watchingList, planToWatchList, setDisplayError} = useContext(AnimeContext)

    // Which List
    const [listSelected, setListSelected] = useState('cw');

    // Which Filter
    const [cwFilter, setCWFilter] = useState(null);
    const [ptwFilter, setPTWFilter] = useState(null);

    const handleCWFilter = (event) => {
        const value = event.target.value;

        const div = document.getElementById('list-of-anime-cards');
        div.classList.add('change');

        if(cwFilter === value) {
            setCWFilter(null);
            
        } else {
            setCWFilter(value);
        }
        
        setTimeout(() => {
            div.classList.remove('change');
        }, 400);
    };

    const handlePTWFilter = (event) => {
        const value = event.target.value;

        const div = document.getElementById('list-of-anime-cards');
        div.classList.add('change');

        if(ptwFilter === value) {
            setPTWFilter(null);
        } else {
            setPTWFilter(value);
        }

        setTimeout(() => {
            div.classList.remove('change');
        }, 400);
    };

    useEffect(() => {
        getUsersAnime(handleSuccess, setLoaded, setError);
    }, []);
    
    return(
        <>
            <div className='progress-display-anime' id='progress-display-anime-list'>
            {loaded ? (
                <div className='list-of-anime-cards' id='list-of-anime-cards'>
                    {listSelected === 'cw'?
                        displayCurrWatchingAnimeList(watchingList, error, handleSuccess, setError, setLoaded, cwFilter)
                        :
                        listSelected === 'ptw' ?
                        displayPlanToWatchList(planToWatchList, error, handleSuccess, setError, setLoaded, ptwFilter)
                        :
                        null
                    }
                </div>
            ) : (
                <div className='anime-card-loading-container'>
                    <svg className='anime-card-loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                    </svg>
                    <p className='anime-card-loading'>Loading...</p>
                </div>
            )}
            </div>
            <svg className='progress-bot-divider' preserveAspectRatio='none' viewBox="0 0 469 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="16.75" width="9.51499" height="9.44579" fill="#E2C893"/>
            <path d="M85.4004 33.5425L80 29.3444H274.414L279.815 33.5425H85.4004Z" fill="#AEBCC5"/>
            <path d="M287.795 29.4152L291.729 36.4245L283.647 36.3019L287.795 29.4152Z" fill="#1166B3"/>
            <rect x="232.24" y="16.75" width="135.324" height="3.1486" fill="#A0D2FF"/>
            <rect x="308.36" y="21.9977" width="159.64" height="4.19813" fill="#E2C893"/>
            <path d="M449.069 17.15L441 10.75H451.759L455.793 13.95L459.828 17.15H449.069Z" fill="#79BFFF"/>
            <path d="M435.069 17.15L427 10.75H437.759L441.793 13.95L445.828 17.15H435.069Z" fill="#79BFFF"/>
            </svg>
            <div className='progress-filters'>
                {listSelected === 'cw' &&
                    (
                    <div className='display-anime-filters' id='cw-anime-filters'>
                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="curr_airing" checked={cwFilter === "curr_airing"} onChange={handleCWFilter}/>
                            <span className="check-button"></span>
                            Currently Airing Only
                        </label>

                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="fin_airing" checked={cwFilter === "fin_airing"} onChange={handleCWFilter}/>
                            <span className="check-button"></span>
                            Finished Airing Only
                        </label>
                    </div>
                    )
                }
                {listSelected === 'ptw' && (
                    <div className='display-anime-filters' id='ptw-anime-filters'>
                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="curr_not_yet_airing" checked={ptwFilter === "curr_not_yet_airing"} onChange={handlePTWFilter}/>
                            <span className="check-button"></span>
                            Not Yet or Currently Airing Only
                        </label>

                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="fin_only" checked={ptwFilter === "fin_only"} onChange={handlePTWFilter}/>
                            <span className="check-button"></span>
                            Finished Only
                        </label>
                    </div>
                )}
                <div className='display-which-list'>
                    <button id='change-list-button-cw' className='change-list-button active-list' onClick={() => changeDisplayedList('cw', setListSelected, listSelected)}>
                        Currently Airing
                    </button>
                    <button id='change-list-button-ptw' className='change-list-button' onClick={() => changeDisplayedList('ptw', setListSelected, listSelected)}>
                        Plan To Watch
                    </button>
                </div>
            </div>
        </>
    );
}

export default DisplayAnimeProgress;