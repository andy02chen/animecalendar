import Calendar from "./Calendar/Calendar";
import AnimeProgress from "./Anime/AnimeProgress";
import "./MainComponent.css"
import Month from './Calendar/Month';

function MainComponent() {
    return(
        <>
            <div className='main-div'>
                <div className="anime-progress-div">
                    <AnimeProgress/>
                </div>

                <div className="calendar-div">
                    <div className="month-div">
                        <div></div>
                        <Month/>
                        <div></div>
                    </div>
                    <Calendar/>
                </div>
            </div>
        </>
    );
}

export default MainComponent;