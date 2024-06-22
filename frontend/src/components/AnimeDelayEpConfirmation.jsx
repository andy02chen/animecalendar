// Delays this week's episode
function setDelay(anime, setRefreshAnimeDisplay, displayDiv) {
    if(localStorage.getItem(anime) !== null) {
        localStorage.setItem(anime, Number(localStorage.getItem(anime)) + 1) 
    } else {
        localStorage.setItem(anime,1);
    }

    displayDiv('delay',anime);
    setRefreshAnimeDisplay(prevFlag => !prevFlag);
}

function AnimeDelayEpConfirmation({anime, setRefreshAnimeDisplay, displayDiv}) {
    return(
        <div className={'delay'+anime} style={{display:'none'}}>
            <p>Are you sure?</p>
            <p>Is this episode really delayed? Please confirm</p>
            <button onClick={() => setDelay(anime, setRefreshAnimeDisplay, displayDiv)}>Yes</button>
            <button onClick={() => displayDiv('delay',anime)}>No</button>
        </div>
    );
}

export default AnimeDelayEpConfirmation;