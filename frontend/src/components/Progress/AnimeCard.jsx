import './AnimeCard.css';
import {useState} from 'react';


function increaseAnimeProgress(anime, setUpdate) {
    anime.increaseProgress();
    setUpdate(u => !u);

    if(anime.totalEpisodes > 0 && anime.currentProgress === anime.totalEpisodes) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = true;
    }

    // if(anime.currentProgress > anime.minProgress) {
    //     document.getElementById(`decrease-progress-${anime.id}`).disabled = false;
    // }
}

function decreaseAnimeProgress(anime, setUpdate) {
    anime.decreaseProgress();
    setUpdate(u => !u);

    if (anime.currentProgress === anime.minProgress) {
        document.getElementById(`increase-progress-${anime.id}`).disabled = false;
    }
}

function AnimeCard({anime, type}) {

    const [update, setUpdate] = useState(false);
    
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
                    {type === "cw" && 
                        <>
                            <div className='anime-card-progress-buttons'>
                                <button className="anime-card-change-progress-button" id={`decrease-progress-${anime.id}`} disabled={anime.currentProgress <= anime.minProgress} 
                                onClick={() => decreaseAnimeProgress(anime, setUpdate)}>-</button>
                                <p className='card-progress'>{anime.currentProgress}/{anime.totalEpisodes === 0 ? "?" : anime.totalEpisodes}</p>
                                <button className='anime-card-change-progress-button' id={`increase-progress-${anime.id}`} onClick={() => increaseAnimeProgress(anime, setUpdate)}>+</button>
                            </div>
                            <div style={outerProgress}><div style={innerProgress}></div></div>
                            <div className='card-progress-buttons'>
                                <button className="card-progress-button negative-button">
                                    Delayed
                                </button>
                                <button className="card-progress-button positive-button">
                                    Watched
                                </button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default AnimeCard;