
// Delays this week's episode
function setDelay(anime, setRefreshAnimeDisplay, displayDiv, nextEpDate) {
    if(localStorage.getItem(anime) !== null) {
        const storedDateArrayString = localStorage.getItem(anime);
        const dateArray = JSON.parse(storedDateArrayString).map(dateString => new Date(dateString));
        dateArray.push(nextEpDate);
        localStorage.setItem(anime, JSON.stringify(dateArray));
    } else {
        localStorage.setItem(anime,JSON.stringify([nextEpDate]));
    }

    displayDiv('delay',anime);
    setRefreshAnimeDisplay(prevFlag => !prevFlag);
}

function AnimeDelayEpConfirmation({anime, setRefreshAnimeDisplay, displayDiv, nextEpDate}) {

    return(
        <div className={'delay'+anime.id} style={{display:'none'}}>
            <p className="episode-status">Is this episode really delayed? </p>
            <div className="button-choice-div">
                <button className="negative-button" onClick={() => displayDiv('delay',anime.id)}>No</button>
                <button className="positive-button" onClick={() => setDelay(anime.id, setRefreshAnimeDisplay, displayDiv, nextEpDate)}>Yes</button>
            </div>
        </div>
    );
}

export default AnimeDelayEpConfirmation;