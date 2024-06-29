import axios from "axios";
import { useState } from "react";

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
    })
    .catch(error => {
        // TODO Display error
        console.log(error);
    });
}

function RateAnime({anime, setRefreshAnimeDisplay, displayDiv}) {
    const [rating, setRating] = useState(1);

    const handleInput = (event) => {
        setRating(event.target.value);
    }

    return(
        <div className={'rating'+anime.id} style={{display:'none'}}>
            <p className="episode-status">Would you like to leave a rating?</p>
            <div>
                <input
                    style={{width: "80%"}}
                    onChange={handleInput} id="rating-slider" 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue={rating}/>
                <p style={{fontSize: "1.5rem"}} id="rating-output">{rating}</p>
            </div>
            <div className="button-choice-div">
                <button className="negative-button" onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 0, displayDiv)}>Skip</button>
                <button className="positive-button" onClick={() => updateStatus(anime, setRefreshAnimeDisplay, rating, displayDiv)}>Confirm</button>
            </div>
        </div>
    );
}

export default RateAnime;