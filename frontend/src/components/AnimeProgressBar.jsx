
function AnimeProgressBar({anime}) {
    const progress = anime.eps === 0 ? 60: (anime.eps_watched / anime.eps) * 100;

    const styles = {
        width: "100%",
        border: "2px solid #666666",
        borderRadius: "25px",
        background: `linear-gradient(to right, 
                        hsla(120, 100%, 39%, 0.95) 0%,
                        hsla(120, 100%, 39%, 0.95) ${String(progress) + "%"},
                        hsla(0, 0%, 0%, 0.35) ${String(progress) + "%"},
                        hsla(0, 0%, 0%, 0.35) 100%)`
    }

    return(
        <div style={styles}>
            <p>{anime.eps_watched}/{anime.eps === 0 ? '?' : anime.eps}</p>                                    
        </div>
    );
}

export default AnimeProgressBar;