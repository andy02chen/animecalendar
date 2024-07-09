import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimeAvailableDate from './AnimeAvailableDate';

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

// Displays weekly anime
const renderContent = (weeklyAnime, displayAnime, failedRequest, setWeeklyAnime, setDisplayAnime, setFailedRequest, setGotRequest) => {
    // Returns error message if failed get request
    if(failedRequest) {
        document.getElementById('popup-error-message').textContent = "Rate Limit Exceeded. Please stop spamming and try refreshing later.";
        const popup = document.getElementById("error-popup");
        popup.classList.remove("hide-error");
        popup.classList.add("show-error");

        return(
            <div className='message-div'>
                <p className='message-text'>Unable to get weekly anime. Please refresh or try again later.</p>
                <button className='refresh-button' onClick={() => {
                    getWeeklyAnime(setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest);
                }}>Refresh</button>
            </div>
        );
    } else {
        // Displays list of anime
        if(displayAnime.length > 0) {
            return(
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

function getWeeklyAnime(setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest) {
    // Get users weekly anime
    setGotRequest(false);
    axios.get('/api/get-weekly-anime')
    .then(response => {
        setWeeklyAnime(response.data.anime);
        setDisplayAnime(response.data.anime);
        setFailedRequest(false);
        setGotRequest(true);
    })
    .catch (error => {
        localStorage.setItem('errorMsgDiv', '3');
        setFailedRequest(true);
        setGotRequest(true);
    });
}

function displayDropDown() {
    const userDropDown = document.getElementById("dropdown-div");
    if(userDropDown.style.display === "none") {
        userDropDown.style.display = "block";
    } else {
        userDropDown.style.display = "none";
    }
}

function AnimeProgress() {
    const [displayAnime, setDisplayAnime] = useState([]);
    const [weeklyAnime, setWeeklyAnime] = useState([]);
    const [gotRequest, setGotRequest] = useState(false);
    const [failedRequest, setFailedRequest] = useState(false);

    useEffect(() => {
        getWeeklyAnime(setWeeklyAnime,setDisplayAnime,setFailedRequest,setGotRequest);
    },[]);

    return(
        <>
            <div className='heading'>
                <div className='heading-top'>
                    <h1 className='weekly-title'>
                        ANIME
                        <br/>
                        PROGRESS</h1>
                    <div className='user-div' id='user-div' onClick={() => displayDropDown()}>
                        <p className='user-div-text'>Username 🔽</p>
                        <div id="dropdown-div">
                            <button className="button-style">
                                <svg className="button-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                            </button>
                            <button className="button-style" onClick={() => logOut()}>Log Out</button>
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
                        renderContent(weeklyAnime, displayAnime, failedRequest, setWeeklyAnime, setDisplayAnime, setFailedRequest, setGotRequest)
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