import './AnimeCard.css';
import {useState, useContext} from 'react';
import { AnimeContext } from '../Pages/CalendarPage';
import NextEpisodeStatus from './NextEpisodeStatus';

function increaseAnimeProgress(anime, setUpdate) {
    anime.increaseProgress();
    setUpdate(u => !u);

    if(anime.totalEpisodes > 0 && anime.currentProgress === anime.totalEpisodes) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = true;
    }
}

function decreaseAnimeProgress(anime, setUpdate) {
    anime.decreaseProgress();
    setUpdate(u => !u);

    if (anime.currentProgress === anime.minProgress || anime.currentProgress < anime.totalEpisodes) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = false;
    }
}

function updateAnimeProgress(anime, setUpdate, setLoading, setDisplayError, rating) {
    if(anime.currentProgress === anime.totalEpisodes) {
        anime.markCompleted();
    }

    anime.setRating(rating);
    setLoading(true);
    anime.updateWatchedEpisodes().then((result) => {
    if (result) {
        setUpdate(u => !u);
    } else {
        localStorage.setItem('errorType', 'update_anime_error');
        setDisplayError(e => !e);
    }
    setLoading(false);
    });
}

function AnimeCard({anime, type}) {

    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setDisplayError } = useContext(AnimeContext);

    const [rating, setRating] = useState('0');

    const handleInput = (event) => {
        setRating(event.target.value);
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

    return(
        <div className='anime-card'>
            <div>
                <h1 className='anime-card-title'>{anime.title}</h1>
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
                                onClick={() => decreaseAnimeProgress(anime, setUpdate)}>-</button>
                                <p className='card-progress'>{anime.currentProgress}/{anime.totalEpisodes === 0 ? "?" : anime.totalEpisodes}</p>
                                <button className='anime-card-change-progress-button' id={`increase-progress-${anime.id}`} onClick={() => increaseAnimeProgress(anime, setUpdate)}>+</button>
                            </div>
                            <div style={outerProgress}><div style={innerProgress}></div></div>
                            <div className='anime-card-status'>
                                <NextEpisodeStatus anime={anime} type={type}/>
                            </div>
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
                                    <button className="card-progress-button negative-button">
                                        Delayed
                                    </button>
                                }
                                {anime.currentProgress === anime.minProgress || anime.completed?
                                    null
                                    :
                                    <button className="card-progress-button positive-button"
                                    onClick={() => updateAnimeProgress(anime, setUpdate, setLoading, setDisplayError, rating)}>
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
                            {/* TODO add buttons for started watching */}
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