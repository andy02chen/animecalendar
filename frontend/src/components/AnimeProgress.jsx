import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import AnimeProgressBar from './AnimeProgressBar';
import AnimeAvailableDate from './AnimeAvailableDate';

function AnimeProgress() {
    const [weeklyAnime, setWeeklyAnime] = useState([]);

    useEffect(() => {
        // Get users weekly anime
        axios.get('/api/get-weekly-anime')
        .then(response => {
            console.log(response.data.anime)
            setWeeklyAnime(response.data.anime);
        })
        .catch (error => {
            console.error(error)
        });
    },[]);

    return(
        <>
            <div className='heading'>
                <h1 className='title'>Weekly Anime Progress</h1>
            </div>

            <div className='progress-div'>
                <ul className='anime-list'>
                    {
                        weeklyAnime.map((anime,index) =>
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
                                {index === weeklyAnime.length - 1 ? <div></div> : <div className='anime-div-bar'></div> }
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    );
}

export default AnimeProgress;