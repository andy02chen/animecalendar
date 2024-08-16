import { MyContext } from "../Pages/HomePage";
import { useContext } from "react";

// Delays this week's episode
function setDelay(anime, setRefreshAnimeDisplay, displayDiv, setRenderAllComponents) {
    if(localStorage.getItem(anime.id) !== null) {

        const existingDictString = localStorage.getItem(anime.id);
        let myDict = existingDictString ? JSON.parse(existingDictString) : {};

        if(myDict[anime.eps_watched] === undefined) {
            myDict[anime.eps_watched] = 1;
        } else {
            myDict[anime.eps_watched] = myDict[anime.eps_watched] + 1;
        }

        localStorage.setItem(anime.id, JSON.stringify(myDict));
    } else {
        const dict = {};
        dict[anime.eps_watched] = 1;
        localStorage.setItem(anime.id, JSON.stringify(dict));
    }

    displayDiv('delay',anime.id);
    setRefreshAnimeDisplay(c => c+1);
    setRenderAllComponents(c => c+1);
}

function AnimeDelayEpConfirmation({anime, setRefreshAnimeDisplay, displayDiv, nextEpDate, setRenderAllComponents}) {
    const userContext = useContext(MyContext);

    return(
        <>
            {userContext === 'Guest' ?
                null
                :
                <div className={'delay'+anime.id} style={{display:'none'}}>
                    <p className="episode-status">Is this episode really delayed? </p>
                    <div className="button-choice-div">
                        <button className="negative-button" onClick={() => displayDiv('delay',anime.id)}>No</button>
                        <button className="positive-button" onClick={() => setDelay(anime, setRefreshAnimeDisplay, displayDiv, setRenderAllComponents)}>Yes</button>
                    </div>
                </div>
            }
        </>
    );
}

export default AnimeDelayEpConfirmation;