import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimeProgressBar from './AnimeProgressBar';
import AnimeAvailableDate from './AnimeAvailableDate';
// import loading from './imgs/spinner-solid.svg';
import loading from './imgs/circle-notch-solid.svg';

function searchAnime(event, weeklyAnime, setDisplayAnime) {
    let findAnime = event.target.value;

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

const renderContent = (displayAnime) => {

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
                                    <AnimeProgressBar anime={anime}/>
                                    <AnimeAvailableDate anime={anime}/>
                                </div>
                            </div>
                        </div>
                        {index === displayAnime.length - 1 ? <div></div> : <div className='anime-div-bar'></div> }
                    </li>
                )}
            </ul>
        )
    } else {
        return(
            <p>No anime found</p>
        );
    }
};

function AnimeProgress() {
    const [displayAnime, setDisplayAnime] = useState([]);
    const [weeklyAnime, setWeeklyAnime] = useState([]);
    const [gotRequest, setGotRequest] = useState(false);

    useEffect(() => {
        // Get users weekly anime
        axios.get('/api/get-weekly-anime')
        .then(response => {
            setWeeklyAnime(response.data.anime);
            setDisplayAnime(response.data.anime);
            setGotRequest(true);
        })
        .catch (error => {
            console.error(error);
        });
    },[]);

    return(
        <>
            <div className='heading'>
                <h1 className='title'>Weekly Anime Progress</h1>
                <div className='search-anime-div'>
                    <input id='search-value' onChange={(event) => searchAnime(event,weeklyAnime,setDisplayAnime)} className='search-weekly-anime' type='text' placeholder='Enter Anime title'></input>
                </div>
            </div>
            <div className='progress-div'>
                    {gotRequest ?
                        renderContent(displayAnime)
                        :
                        <div className='loading-div'>
                            <img className='loading-spinner' alt="Loading..." src={loading}/>
                            <p className='loading-text'>Loading...</p>
                        </div>
                        
                    }
            </div>
        </>
    );
}

export default AnimeProgress;