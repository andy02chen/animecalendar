import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import AnimeAvailableDate from './AnimeAvailableDate';
import defaultpfp from '../imgs/defaultpfp.png';

// Searches weekly anime and displays them
function searchAnime(event, weeklyAnime, setDisplayAnime) {
    let findAnime = event.target.value.trim();

    if(findAnime) {
        const returnAnimes = [];

        for(let anime of weeklyAnime) {
            if(anime.title.toLowerCase().includes(findAnime.toLowerCase())) {
                returnAnimes.push(anime);
            }
        }
        setDisplayAnime(returnAnimes);
    } else {
        setDisplayAnime(weeklyAnime);
    }
}

// Expands the list of plan to watch anime
const expandPlanToWatchDiv = () => {
    const watchingList = document.getElementById('anime-list-div-watching');
    const planToWatchList = document.getElementById('anime-list-div-plan-to-watch');
    const planToWatchBar = document.getElementById('plan-to-watch-animes-div');

    const disableCurrWatchingDiv = document.getElementById('curr-watching-animes-div');
    const disablePlanWatchDiv = document.getElementById('plan-to-watch-animes-div');

    disableCurrWatchingDiv.style.pointerEvents = "none";
    disablePlanWatchDiv.style.pointerEvents = "none";

    if(planToWatchList.style.display === "none") {
        watchingList.style.height = "0px";
        setTimeout(() => {
            watchingList.style.display = "none";
            planToWatchBar.style.borderTop = "none";

            disableCurrWatchingDiv.style.pointerEvents = "auto";
            disablePlanWatchDiv.style.pointerEvents = "auto";
        }, 500);

        planToWatchList.style.display = "block";
        planToWatchList.style.height = "100%";
        planToWatchBar.style.borderBottom = "1px solid var(--primary)";
    } else {
        planToWatchList.style.height = "0px";
        planToWatchBar.style.borderTop = "1px solid var(--primary)";

        setTimeout(() => {
            planToWatchBar.style.borderBottom = "none";
            planToWatchList.style.display = "none";
            disableCurrWatchingDiv.style.pointerEvents = "auto";
            disablePlanWatchDiv.style.pointerEvents = "auto";
        }, 500);

        watchingList.style.display = "block";
        watchingList.style.height = "100%";
    }
}

// Expands the div of currently watching anime
const expandCurrWatchingDiv = () => {
    const currWatchingList = document.getElementById('anime-list-div-watching');
    const planToWatchList = document.getElementById('anime-list-div-plan-to-watch');
    const planToWatchBar = document.getElementById('plan-to-watch-animes-div');

    const disableCurrWatchingDiv = document.getElementById('curr-watching-animes-div');
    const disablePlanWatchDiv = document.getElementById('plan-to-watch-animes-div');

    disableCurrWatchingDiv.style.pointerEvents = "none";
    disablePlanWatchDiv.style.pointerEvents = "none";

    if(currWatchingList.style.display === "none") {
        planToWatchList.style.height = "0px";
        planToWatchBar.style.borderTop = "1px solid var(--primary)";
        setTimeout(() => {
            planToWatchBar.style.borderBottom = "none";
            planToWatchList.style.display = "none";
            disableCurrWatchingDiv.style.pointerEvents = "auto";
            disablePlanWatchDiv.style.pointerEvents = "auto";
        }, 500);

        currWatchingList.style.display = "block";
        currWatchingList.style.height = "100%";
    } else {
        planToWatchBar.style.borderBottom = "1px solid var(--primary)";
        currWatchingList.style.height = "0px";
        setTimeout(() => {
            currWatchingList.style.display = "none";
            planToWatchBar.style.borderTop = "none";
            disableCurrWatchingDiv.style.pointerEvents = "auto";
            disablePlanWatchDiv.style.pointerEvents = "auto";
        }, 500);
        
        planToWatchList.style.display = "block";
        planToWatchList.style.height = "100%";
    }
}

// Displays curr airing anime
const displayCurrAiring = (event, currAiringAnime,weeklyAnime, setDisplayAnime) => {
    const currWatchingList = document.getElementById('anime-list-div-watching');
    const planToWatchList = document.getElementById('anime-list-div-plan-to-watch');
    const planToWatchBar = document.getElementById('plan-to-watch-animes-div');

    if(currWatchingList.style.display === "none") {
        if(event.target.checked) {
            setDisplayAnime(currAiringAnime);
        } else {
            setDisplayAnime(weeklyAnime);
        }

        planToWatchList.style.height = "0px";
        planToWatchBar.style.borderTop = "1px solid var(--primary)";
        setTimeout(() => {
            planToWatchBar.style.borderBottom = "none";
            planToWatchList.style.display = "none";
        }, 500);

        currWatchingList.style.display = "block";
        currWatchingList.style.height = "100%";
    } else {
        if(event.target.checked) {
            currWatchingList.classList.add("checkbox-selected-transition");
            setTimeout(() => {
                setDisplayAnime(currAiringAnime);
                currWatchingList.classList.remove("checkbox-selected-transition");
            }, 500);
        } else {
            currWatchingList.classList.add("checkbox-selected-transition");
            setTimeout(() => {
                setDisplayAnime(weeklyAnime);
                currWatchingList.classList.remove("checkbox-selected-transition");
            }, 500);
        }
    }
}

// Displays Not Yet Aired Anime
const displayNotYetAired = (event, notYetAiredList, planToWatchAnimeList, setPlanToWatch) => {
    const watchingList = document.getElementById('anime-list-div-watching');
    const planToWatchList = document.getElementById('anime-list-div-plan-to-watch');
    const planToWatchBar = document.getElementById('plan-to-watch-animes-div');

    if(planToWatchList.style.display === "none") {
        if(event.target.checked) {
            setPlanToWatch(notYetAiredList);
        } else {
            setPlanToWatch(planToWatchAnimeList);
        }

        watchingList.style.height = "0px";
        setTimeout(() => {
            watchingList.style.display = "none";
            planToWatchBar.style.borderTop = "none";
        }, 500);

        planToWatchList.style.display = "block";
        planToWatchList.style.height = "100%";
        planToWatchBar.style.borderBottom = "1px solid var(--primary)";
    } else {
        if(event.target.checked) {
            planToWatchList.classList.add("checkbox-selected-transition");
            setTimeout(() => {
                setPlanToWatch(notYetAiredList);
                planToWatchList.classList.remove("checkbox-selected-transition");
            }, 500);
        } else {
            planToWatchList.classList.add("checkbox-selected-transition");
            setTimeout(() => {
                setPlanToWatch(planToWatchAnimeList);
                planToWatchList.classList.remove("checkbox-selected-transition");
            }, 500);
        }
    }
}

// Displays weekly anime
const renderContent = (divForPlanToWatchAnime,divForWatchingAnime,notYetAiredList,planToWatchAnimeList,displayPlanToWatch,currAiringAnime, weeklyAnime, displayAnime, failedRequest,setPlanToWatch, setWeeklyAnime, setDisplayAnime, setFailedRequest, setGotRequest, setNotYetAiredList, setPlanToWatchAnimeList, setCurrAiringAnime) => {
    // Returns error message if failed get request
    if(failedRequest) {
        const popup = document.getElementById("error-popup");
        popup.classList.remove("hide-error");
        popup.classList.add("show-error");

        return(
            <div className='message-div'>
                <p className='message-text'>Unable to get weekly anime. Please refresh or try again later.</p>
                <button className='refresh-button' onClick={() => {
                    getWeeklyAnime(setPlanToWatch,setNotYetAiredList,setPlanToWatchAnimeList,setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest,setCurrAiringAnime);
                }}>Refresh</button>
            </div>
        );
    } else {
        // Displays list of anime
        if(displayAnime.length > 0) {
            return(
                <>
                    <div onClick={() => expandCurrWatchingDiv()} id='curr-watching-animes-div' className='progress-section-div watching-div'>
                        <p className='progress-section-heading'>Watching</p>
                        <div className='checkbox-container'>
                            <input onClick={(event) => event.stopPropagation()} onChange={(event) => displayCurrAiring(event, currAiringAnime, weeklyAnime, setDisplayAnime)} type='checkbox' id='currently-airing' name='currently-airing' value="curr-airing"></input>
                            <label onClick={(event) => event.stopPropagation()} htmlFor="currently-airing" className='anime-progress-checkbox'> Show Currently Airing Only</label>
                        </div>
                    </div>
                    <div ref={divForWatchingAnime} id='anime-list-div-watching'>
                        <ul className='anime-list'>
                            {displayAnime.map((anime,index) =>
                                <li key={index} className='weekly-anime'>
                                    <div className='anime'>
                                        <div className='anime-top-div'>
                                            <h1 className='anime-list-title'>{anime.title}</h1>
                                        </div>
                                        <div className='anime-bot-div'>
                                            <div>
                                                <img className='weekly-anime-img' src={anime.img} alt={`Image of ${anime.title}`}></img>
                                            </div>

                                            <div id={anime.id+'ep-details-div'} className='anime-bot-ep'>
                                                <AnimeAvailableDate anime={anime}/>
                                            </div>

                                            <div id={anime.id+'update-spinner'} className='update-div'>
                                                <svg className="update-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path  d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
                                                <p>Updating...</p>
                                            </div>
                                        </div>
                                    </div>
                                    {index === displayAnime.length - 1 ? <div></div> : <div className='anime-div-bar'></div> }
                                </li>
                            )}
                        </ul>
                    </div>
                    {displayPlanToWatch.length > 0 ?
                        <>
                            <div id='plan-to-watch-animes-div' className='progress-section-div plan-to-watch-div' onClick={() => expandPlanToWatchDiv()}>
                                <p className='progress-section-heading'>Plan To Watch</p>
                                <div className='checkbox-container'>
                                    <input onClick={(event) => event.stopPropagation()} onChange={(event) => displayNotYetAired(event, notYetAiredList, planToWatchAnimeList, setPlanToWatch)}  type='checkbox' id='plan-to-watch-check' name='plan-to-watch-check' value="plan-to-watch-value"></input>
                                    <label onClick={(event) => event.stopPropagation()} htmlFor="plan-to-watch-check" className='anime-progress-checkbox'> Show Not Yet Aired Only</label>
                                </div>
                            </div>
                            <div ref={divForPlanToWatchAnime} id='anime-list-div-plan-to-watch' style={{display: 'none'}}>
                                <ul className='anime-list' >
                                    {displayPlanToWatch.map((anime,index) =>
                                        <li key={index} className='weekly-anime'>
                                            <div className='anime'>
                                                <div className='anime-top-div'>
                                                    <h1 className='anime-list-title'>{anime.title}</h1>
                                                </div>
                                                <div className='anime-bot-div'>
                                                    <div>
                                                        <img className='weekly-anime-img' src={anime.img} alt={`Image of ${anime.title}`}></img>
                                                    </div>
                                                </div>
                                            </div>
                                            {index === displayPlanToWatch.length - 1 ? <div></div> : <div className='anime-div-bar'></div> }
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </>
                        :
                        null
                    }
                    
                </>
            )
        } else if(weeklyAnime.length == 0) {
            return(
                <div className='message-div'>
                    <p className='message-text'>Please add anime to watch list on <a href='https://myanimelist.net/' target="_blank">MyAnimeList</a> then refresh this page.</p>
                </div>
            );
        } else {
            // Returns message if unable to find anime with keywords
            return(
                <div className='message-div'>
                    <p className='message-text'>No results found for "{document.getElementById('search-value').value}". 
                        Please try a different search term.</p>
                </div>
            );
        }
    }
};

function getWeeklyAnime(setPlanToWatch,setNotYetAiredList,setPlanToWatchAnimeList,setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest,setCurrAiringAnime) {
    // Get users weekly anime
    setGotRequest(false);
    axios.get('/api/get-weekly-anime')
    .then(response => {
        setWeeklyAnime(response.data.anime);
        setDisplayAnime(response.data.anime);
        
        const currAiring = [];
        for(let anime of response.data.anime) {
            if(anime.air_status === "currently_airing") {
                currAiring.push(anime)
            }
        }
        setCurrAiringAnime(currAiring);

        // Get user's plan to watch list
        axios.get('/api/get-plan-to-watch')
        .then(response => {
            setPlanToWatchAnimeList(response.data.plan_to_watch);
            setPlanToWatch(response.data.plan_to_watch);

            const notYetAired = [];
            for(let anime of response.data.plan_to_watch) {
                if(anime.air_status === "not_yet_aired") {
                    notYetAired.push(anime)
                }
            }
            setNotYetAiredList(notYetAired);
            setFailedRequest(false);
            setGotRequest(true);
        })
        .catch(error => {
            if(error.response.status === 429) {
                localStorage.setItem('errorMsgDiv', '3');
                setFailedRequest(true);
                setGotRequest(true);
            } else if (error.response.status === 500) {
                document.getElementById('popup-error-message').textContent = error.response.data;
                const popup = document.getElementById("error-popup");
                popup.classList.add("show-error");
                popup.classList.remove("hide-error");
                setFailedRequest(true);
                setGotRequest(true);
            }
        });
    })
    .catch (error => {
        if(error.response.status === 429) {
            localStorage.setItem('errorMsgDiv', '3');
            setFailedRequest(true);
            setGotRequest(true);
        } else if (error.response.status === 500) {
            document.getElementById('popup-error-message').textContent = error.response.data;
            const popup = document.getElementById("error-popup");
            popup.classList.add("show-error");
            popup.classList.remove("hide-error");
            setFailedRequest(true);
            setGotRequest(true);
        }
    });

}

// Displays the settings div
function displaySettings() {
    const userDropDown = document.getElementById("settings-options-div");
    if(userDropDown.style.display === "none") {
        userDropDown.style.display = "flex";
    } else {
        userDropDown.style.display = "none";
    }
}

function logOut() {
    axios.delete('/api/logout')
        .then(response => {
            localStorage.removeItem('username');
            localStorage.removeItem('pfp');
            document.cookie = 'session=; Max-Age=-99999999;';
            window.location.href = response.data.redirect_url;
        })
}

function AnimeProgress() {
    const [displayAnime, setDisplayAnime] = useState([]);
    const [weeklyAnime, setWeeklyAnime] = useState([]);
    const [gotRequest, setGotRequest] = useState(false);
    const [failedRequest, setFailedRequest] = useState(false);
    const [currAiringAnime, setCurrAiringAnime] = useState([]);
    const [displayPlanToWatch, setPlanToWatch] = useState([]);
    const [planToWatchAnimeList, setPlanToWatchAnimeList] = useState([]);
    const [notYetAiredList, setNotYetAiredList] = useState([]);

    useEffect(() => {
        getWeeklyAnime(setPlanToWatch,setNotYetAiredList,setPlanToWatchAnimeList,setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest,setCurrAiringAnime);
    },[]);

    // When settings div is expanded but user clicks elsewhere
    document.addEventListener("click", function(event) {
        const div = document.getElementById('settings-options-div');
        const username = document.getElementById('settings-div-show-btn')
        let isClickInside = div.contains(event.target) || username.contains(event.target);
    
        if (!isClickInside) {
            div.style.display = "none";
        }
    });

    const divForWatchingAnime = useRef(null);
    const divForPlanToWatchAnime = useRef(null);

    useEffect(() => {    
        const handleScroll = (event) => {
            const currentElement = divForWatchingAnime.current;
            if (currentElement) {
                const { scrollTop, scrollHeight, clientHeight } = currentElement;
                if (scrollHeight - scrollTop === clientHeight && event.deltaY > 0) {
                    expandPlanToWatchDiv();
                }
            }
        };
    
        const currentElement = divForWatchingAnime.current;
        if (currentElement) {
            currentElement.addEventListener('wheel', handleScroll);
        }
    
        // Cleanup function
        return () => {
            if (currentElement) {
                currentElement.removeEventListener('wheel', handleScroll);
            }
        };
    }, [divForWatchingAnime.current]);

    useEffect(() => {    
        const handleScroll = (event) => {
            const currentElement = divForPlanToWatchAnime.current;
            if (currentElement) {
                const { scrollTop, scrollHeight, clientHeight } = currentElement;
                if (scrollTop === 0 && event.deltaY < 0) {
                    expandCurrWatchingDiv();
                }
            }
        };
    
        const currentElement = divForPlanToWatchAnime.current;
        if (currentElement) {
            currentElement.addEventListener('wheel', handleScroll);
        }
    
        // Cleanup function
        return () => {
            if (currentElement) {
                currentElement.removeEventListener('wheel', handleScroll);
            }
        };
    }, [divForPlanToWatchAnime.current]);

    return(
        <>
            <div className='heading'>
                <div className='heading-top'>
                    <h1 className='weekly-title'>
                        ANIME
                        <br/>
                        WATCHLIST</h1>

                    <div className='settings-dropdown'>
                        <button className='dropdown-btn' id='settings-div-show-btn' onClick={() => displaySettings()}>
                            <img className='user-profile-pic' alt="pfp" src={localStorage.getItem('pfp') === 'null' ? defaultpfp : localStorage.getItem('pfp') }
                            />
                            {localStorage.getItem('username')}
                            <svg className='settings-div-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                        </button>
                        <div className='settings-hide' id='settings-options-div' style={{display: 'none'}}>
                            <button className='dropdown-btn'>
                                <svg className='settings-div-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                                Settings
                            </button>
                            <button className='dropdown-btn' onClick={() => logOut()}>
                            <svg className='settings-div-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
                <div className='search-anime-div'>
                    <input id='search-value' onChange={(event) => 
                        searchAnime(event,weeklyAnime,setDisplayAnime)
                    } className='search-weekly-anime' type='text' placeholder='Search for an anime title from your watchlist'/>
                </div>
                <p className="release-note">Note: The release times are based on MyAnimeList data and may not reflect availability on your chosen streaming platform. </p>
            </div>
            <div className='progress-div'>
                    {gotRequest ?
                        renderContent(divForPlanToWatchAnime,divForWatchingAnime,notYetAiredList,planToWatchAnimeList,displayPlanToWatch,currAiringAnime, weeklyAnime, displayAnime, failedRequest,setPlanToWatch, setWeeklyAnime, setDisplayAnime, setFailedRequest, setGotRequest, setNotYetAiredList, setPlanToWatchAnimeList, setCurrAiringAnime)
                        :
                        <div className='message-div'>
                            <svg className='loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
                            <p className='message-text'>Loading...</p>
                        </div>
                    }
            </div>
        </>
    );
}

export default AnimeProgress;