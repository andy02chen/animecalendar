import axios from "axios";

// Updates the number of episodes watched on MyAnimeList
function updateStatus(anime, setRefreshAnimeDisplay, score, displayDiv) {
    let data = {}

    if(score === 0) {
        data = {
            'anime-id': anime.id,
            'eps-watched': anime.eps_watched
        }
    } else {
        data = {
            'anime-id': anime.id,
            'eps-watched': anime.eps_watched,
            'score': score
        }
    }

    let updateFeedback = document.getElementById(anime.id+"update-spinner");
    updateFeedback.style.display = "inline";

    let updateFeedback2 = document.getElementById(anime.id+'ep-details-div');
    updateFeedback2.style.display = "none";

    axios.post('/api/update-anime', data)
    .then(response => {
        updateFeedback.style.display = "none";
        updateFeedback2.style.display = "flex";
        anime.eps_watched = anime.eps;
        displayDiv('rating',anime.id);
        setRefreshAnimeDisplay(prevFlag => !prevFlag);
        localStorage.removeItem(anime.id);
        console.log('a',anime);
    })
    .catch(error => {
        // TODO Display error
        console.log(error);
    });
}

function RateAnime({anime, setRefreshAnimeDisplay, displayDiv}) {
    return(
        <div className={'rating'+anime.id} style={{display:'none'}}>
            <p>Would you like to leave a rating?</p>
            <div>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 1, displayDiv)}>1</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 2, displayDiv)}>2</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 3, displayDiv)}>3</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 4, displayDiv)}>4</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 5, displayDiv)}>5</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 6, displayDiv)}>6</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 7, displayDiv)}>7</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 8, displayDiv)}>8</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 9, displayDiv)}>9</button>
                <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 10, displayDiv)}>10</button>
            </div>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 0, displayDiv)}>Skip</button>
        </div>
    );
}

export default RateAnime;