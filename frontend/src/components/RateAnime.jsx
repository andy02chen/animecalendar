import axios from "axios";

// Updates the number of episodes watched on MyAnimeList
function updateStatus(anime, setRefreshAnimeDisplay, score) {
    axios.post('/api/update-anime',
        {
            'anime-id': anime.id,
            'eps-watched': anime.eps_watched,
            'score': score
        }
    )
    .then(response => {
        anime.eps_watched++;
        setRefreshAnimeDisplay(prevFlag => !prevFlag);
    })
    .catch(error => {
        // TODO Display error
        console.log(error);
    });
}

// TODO cancel rating when user clicks skip
function RateAnime({anime, setRefreshAnimeDisplay, displayDiv}) {
    return(
        <div className={'rating'+anime.id} style={{display:'none'}}>
            <h3>Would you like to leave a rating?</h3>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 1)}>1</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 2)}>2</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 3)}>3</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 4)}>4</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 5)}>5</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 6)}>6</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 7)}>7</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 8)}>8</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 9)}>9</button>
            <button onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 10)}>10</button>
            <button>Skip</button>
        </div>
    );
}

export default RateAnime;