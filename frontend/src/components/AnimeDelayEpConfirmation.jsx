// Changes display from next epsidoe status to confirmation
function confirm(anime) {
    const parents = document.getElementsByClassName(anime);
    for(let i = 0; i < parents.length; i++) {
        if (parents[i].style.display === 'none') {
            parents[i].style.display = 'block';
        } else {
            parents[i].style.display = 'none';
        }
    }
}

// Delays this week's episode
function setDelay(anime, setRefreshAnimeDisplay) {
    if(localStorage.getItem(anime) !== null) {
        localStorage.setItem(anime, Number(localStorage.getItem(anime)) + 1) 
    } else {
        localStorage.setItem(anime,1);
    }

    confirm(anime);
    setRefreshAnimeDisplay(prevFlag => !prevFlag);
}

function AnimeDelayEpConfirmation({anime, setRefreshAnimeDisplay}) {
    return(
        <div className={anime} style={{display:'none'}}>
            <h1>Are you sure?</h1>
            <p>Is this episode really delayed? Please confirm</p>
            <button onClick={() => setDelay(anime, setRefreshAnimeDisplay)}>Yes</button>
            <button onClick={() => confirm(anime)}>No</button>
        </div>
    );
}

export default AnimeDelayEpConfirmation;