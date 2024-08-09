import Calendar from "./Calendar/Calendar";
import AnimeProgress from "./Anime/AnimeProgress";
import "./MainComponent.css";
import Popup from './Alert/Popup';
import { useState } from "react";

function MainComponent() {
    const [animeInfo, setAnimeInfo] = useState({});

    function handleData(data) {
        setAnimeInfo((prevData) => (
            {
                ...prevData,
                [data.id] : data,
            }
        ));
    }

    return(
        <>
            <Popup/>
            <div className='main-div'>
                <div className="anime-progress-div">
                    <AnimeProgress handleData={handleData}/>
                </div>

                <div className="calendar-div">
                    <div>
                        <Calendar animeData={animeInfo}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainComponent;