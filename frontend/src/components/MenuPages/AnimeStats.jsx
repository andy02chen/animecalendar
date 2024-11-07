import { useState, useEffect } from 'react';
import './AnimeStats.css';
import axios from 'axios';

function closeStats() {
    const div = document.getElementById('anime-stats-page');
    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

function getUserStats(setLoading, setAPICallSuccess, setData) {
    setLoading(true);
    axios.get("/api/user-stats").
    then(response => {
        setData(response.data);
        setAPICallSuccess(true);
    }).catch(error => {
        setData(null);
        setAPICallSuccess(false);
    })
}

function AnimeStats() {
    const [APICallSuccess, setAPICallSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);

    

    // For revealing information
    const [isMalScoreVisible, setMalScoreVisible] = useState(false);
    const [isYourScoreVisible, setYourScoreVisible] = useState(false);

    useEffect(() => {
        const malScoreTimer = setTimeout(() => setMalScoreVisible(true), 3000);
        const yourScoreTimer = setTimeout(() => setYourScoreVisible(true), 4000);

        return () => {
            clearTimeout(malScoreTimer);
            clearTimeout(yourScoreTimer);
        };
    }, []);
    
    useEffect(() => {
        setLoading(false);
    }, [data]); 

    return(
        <div id='anime-stats-page' className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Your Anime Stats</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeStats()}>&#10006;</h1>
                    </div>
                    <div className='anime-stats-page-body'>
                        {loading ?
                        <>
                            <div className='anime-page-loading-container'>
                                <svg className='anime-page-loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                                </svg>
                                <p className='anime-page-loading'>Loading...</p>
                            </div>
                        </>
                        :
                        (APICallSuccess === null || APICallSuccess === false || data === null ?
                            <>
                                <h1 className='stats-warning'>To prevent spamming stats are available every 5 minutes. If you're seeing this message due to a refresh or a loading error, please wait a moment and try again.</h1>
                                <button className='get-stats-button' onClick={() => getUserStats(setLoading, setAPICallSuccess, setData)}> Get my Stats </button>
                            </>
                            :
                            <div className='display-data-div'>
                                <h1 className='data-h1'>
                                    Are you a harsh critic?<br/>
                                    Your Average Rating vs MAL Average
                                </h1>
                                <h2 className='data-h2'>
                                    The average score for the animes you have rated is: <br/>
                                    <span className={isMalScoreVisible ? 'show-data' : 'hide-data'}>
                                    {data["average_rating"]["mal_score"]}
                                    </span>
                                </h2>
                                <h2 className='data-h2'>
                                    Your Average Rating is: <br/>
                                    <span className={isYourScoreVisible ? 'show-data' : 'hide-data'}>
                                    {data["average_rating"]["your_score"]}
                                    </span>
                                </h2>
                            </div>
                        )
                        
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeStats;