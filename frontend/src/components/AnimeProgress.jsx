import './AnimeProgress.css'
import axios from 'axios';
import { useEffect, useState } from 'react';

function AnimeProgress() {
    const [weeklyAnime, setWeeklyAnime] = useState([]);

    useEffect(() => {
        // Get users weekly anime
        axios.get('/api/get-weekly-anime')
        .then(response => {
            console.log(response.data.anime);
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
                                <h1>{anime.title}</h1>
                                <img src={anime.img} alt={`Image of ${anime.title}`}></img>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    );
}

export default AnimeProgress;