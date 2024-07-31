import Calendar from "./Calendar/Calendar";
import AnimeProgress from "./Anime/AnimeProgress";
import "./MainComponent.css"
import Popup from './Alert/Popup'

function MainComponent() {
    return(
        <>
            <Popup/>
            <div className='main-div'>
                <div className="anime-progress-div">
                    <AnimeProgress/>
                </div>

                <div className="calendar-div">
                    <div>
                        <Calendar/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainComponent;