import Settings from "./Settings";
import Calendar from "./Calendar";
import AnimeProgress from "./AnimeProgress";
import "./MainComponent.css"

function MainComponent() {
    return(
        <>
            <div className='main-div'>
                <div className="settings-div">
                    <Settings/>
                </div>
                <div className="anime-progresss-div">
                    <AnimeProgress/>
                </div>
                <div className="calendar-div">
                    <Calendar/>
                </div>
            </div>
        </>
    );
}

export default MainComponent;