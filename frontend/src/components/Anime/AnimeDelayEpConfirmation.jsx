
// Delays this week's episode
function setDelay(anime, setRefreshAnimeDisplay, displayDiv) {
    if(localStorage.getItem(anime.id) !== null) {
        // const storedDateArrayString = localStorage.getItem(anime);
        // const dateArray = JSON.parse(storedDateArrayString).map(dateString => new Date(dateString));
        // dateArray.push(nextEpDate);
        // localStorage.setItem(anime, JSON.stringify(dateArray));

        const existingDictString = localStorage.getItem(anime.id);
        let myDict = existingDictString ? JSON.parse(existingDictString) : {};

        if(myDict[anime.eps_watched] === undefined) {
            myDict[anime.eps_watched] = 1;
        } else {
            myDict[anime.eps_watched] = myDict[anime.eps_watched] + 1;
        }

        localStorage.setItem(anime.id, JSON.stringify(myDict));
    } else {
        // localStorage.setItem(anime,JSON.stringify([nextEpDate]));
        const dict = {};
        dict[anime.eps_watched] = 1;
        localStorage.setItem(anime.id, JSON.stringify(dict));
    }

    displayDiv('delay',anime.id);
    setRefreshAnimeDisplay(prevFlag => !prevFlag);
}

function AnimeDelayEpConfirmation({anime, setRefreshAnimeDisplay, displayDiv, nextEpDate}) {
    return(
        <div className={'delay'+anime.id} style={{display:'none'}}>
            <p className="episode-status">Is this episode really delayed? </p>
            <div className="button-choice-div">
                <button className="negative-button" onClick={() => displayDiv('delay',anime.id)}>No</button>
                <button className="positive-button" onClick={() => setDelay(anime, setRefreshAnimeDisplay, displayDiv)}>Yes</button>
            </div>
        </div>
    );
}

export default AnimeDelayEpConfirmation;