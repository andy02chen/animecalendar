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
                                    <h1>{anime.title}</h1>
                                </div>
                                <div className='anime-bot-div'>
                                    <div>
                                        <img className='weekly-anime-img' src={anime.img} alt={`Image of ${anime.title}`}></img>
                                    </div>
                                    <div className='anime-bot-ep'>
                                        <AnimeAvailableDate anime={anime}/>
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
                <h1 className='title'>Weekly Anime Progress</h1>
                <div className='search-anime-div'>
                    <input id='search-value' onChange={(event) => 
                        searchAnime(event,weeklyAnime,setDisplayAnime)
                    } className='search-weekly-anime' type='text' placeholder='Enter Anime title'/>
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