import axios from "axios";
import { useState, useContext } from "react";
import { MyContext } from "../Pages/HomePage";

// Updates the number of episodes watched on MyAnimeList
function updateStatus(anime, setRefreshAnimeDisplay, score, displayDiv) {
    let data = {}

    if(score === 0) {
        data = {
            'anime-id': anime.id,
            'eps-watched': anime.eps_watched,
            'completed': true
        }
    } else {
        data = {
            'anime-id': anime.id,
            'eps-watched': anime.eps_watched,
            'score': score,
            'completed': true
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
        setRefreshAnimeDisplay(c => c + 1);
        localStorage.removeItem(anime.id);
    })
    .catch(error => {
        if(error.response.status === 502) {
            document.getElementById('popup-error-message').textContent = error.response.data;
            const popup = document.getElementById("error-popup");
            popup.classList.remove("hide-error");
            popup.classList.add("show-error");
            updateFeedback.style.display = "none";
            updateFeedback2.style.display = "flex";
            displayDiv('rating',anime.id);
        } else {
            axios.delete('/api/logout')
            .then(response => {
                document.cookie = "username" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                document.cookie = "pfp" + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

                localStorage.setItem('errorMsgDiv', true);
                document.cookie = 'session=; Max-Age=-99999999;';
                window.location.href = response.data.redirect_url;
            });
        }
    });
}

function RateAnime({anime, setRefreshAnimeDisplay, displayDiv}) {
    const [rating, setRating] = useState(1);
    const userContext = useContext(MyContext);

    const handleInput = (event) => {
        setRating(event.target.value);
    }

    return(
        <>
            {userContext === "Guest" ?
                null
                :
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
                        <p style={{fontSize: "1.5rem", color: "var(--text)", fontWeight: "700"}} id="rating-output">{rating}</p>
                    </div>
                    <div className="button-choice-div">
                        <button className="negative-button" onClick={() => updateStatus(anime, setRefreshAnimeDisplay, 0, displayDiv)}>Skip</button>
                        <button className="positive-button" onClick={() => updateStatus(anime, setRefreshAnimeDisplay, rating, displayDiv)}>Confirm</button>
                    </div>
                </div>
            }
        </>
    );
}

export default RateAnime;