import Calendar from "./Calendar/Calendar";
import AnimeProgress from "./Anime/AnimeProgress";
import "./MainComponent.css";
import Popup from './Alert/Popup';
import { useState, useRef, useEffect } from "react";

function MainComponent() {
    const animeInfo = useRef(new Map());
    const numberOfWatchingAnime = useRef(0);
    const [ready, setReady] = useState(false);

    function handleData(data) {
        animeInfo.current.set(data.id, data);

        if(animeInfo.current.size === numberOfWatchingAnime.current) {
            setReady(true);
        }
    }

    return(
        <>
            <Popup/>
            <div className='main-div'>
                <div className="anime-progress-div">
                    <AnimeProgress handleData={handleData} setNumberOfWatchingAnime={numberOfWatchingAnime}/>
                </div>

                <div className="calendar-div">
                    <div>
                        <Calendar animeData={animeInfo} readyToDisplay={ready}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainComponent;