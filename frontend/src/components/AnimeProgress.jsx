import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimeAvailableDate from './AnimeAvailableDate';
import loading from './imgs/circle-notch-solid.svg';

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
                    <p className='message-text'>Please add currently airing anime to watch list on <a href='https://myanimelist.net/' target="_blank">MyAnimeList</a> then refresh this page.</p>
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
        setFailedRequest(true);
        setGotRequest(true);
    });
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
                <h1 className='weekly-title'>YOUR ANIME PROGRESS</h1>
                <div className='search-anime-div'>
                    <input id='search-value' onChange={(event) => 
                        searchAnime(event,weeklyAnime,setDisplayAnime)
                    } className='search-weekly-anime' type='text' placeholder='Enter Anime title to search'/>
                </div>
            </div>
            <div className='progress-div'>
                    {gotRequest ?
                        renderContent(weeklyAnime, displayAnime, failedRequest, setWeeklyAnime, setDisplayAnime, setFailedRequest, setGotRequest)
                        :
                        <div className='message-div'>
                            <img className='loading-spinner' src={loading}/>
                            <p className='message-text'>Loading...</p>
                        </div>
                    }
            </div>
        </>
    );
}

export default AnimeProgress;