import Calendar from "./Calendar/Calendar";
import AnimeProgress from "./Anime/AnimeProgress";
import "./MainComponent.css";
import Popup from './Alert/Popup';
import { useState, useRef, useEffect } from "react";
// import Feedback from "./Alert/Feedback";
// import Announcement from "./Alert/Announcement";
// import Tutorial from './Alert/Tutorial';

function MainComponent() {
    const animeInfo = useRef(new Map());
    const numberOfWatchingAnime = useRef(0);
    const [ready, setReady] = useState(false);
    const [renderAllComponents, setRenderAllComponents] = useState(0);

    function handleData(data) {
        animeInfo.current.set(data.id, data);

        if(animeInfo.current.size === numberOfWatchingAnime.current) {
            setReady(true);
        }
    }

    return(
        <>
            <Popup/>
            <div className='main-div' id="main-div">
                <div className="anime-progress-div">
                    <AnimeProgress handleData={handleData} setNumberOfWatchingAnime={numberOfWatchingAnime} setRenderAllComponents={setRenderAllComponents}/>
                </div>

                <div className="calendar-div">
                    {!ready?
                        <>
                            <div className='loading-div'>
                                <svg className='loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
                                <p className='message-text'>Loading...</p>
                            </div>
                        </>
                    :
                        <div>
                            <Calendar animeData={animeInfo} renderAllComponents={renderAllComponents}/>
                        </div>
                    }
                </div>
            </div>
            {/* <Feedback/>
            <Announcement/>
            <Tutorial/> */}
        </>
    );
}

export default MainComponent;