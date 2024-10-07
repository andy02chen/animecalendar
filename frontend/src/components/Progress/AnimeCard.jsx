import './AnimeCard.css';

function AnimeCard({anime, type}) {
    
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
                            <p className='card-progress'>{anime.currentProgress}/{anime.totalEpisodes === 0 ? "?" : anime.totalEpisodes}</p>
                            <div style={outerProgress}><div style={innerProgress}></div></div>
                            <div className='card-progress-buttons'>
                                <button>
                                    Delayed
                                </button>
                                <button>
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