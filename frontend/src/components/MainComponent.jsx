import Settings from "./Settings";
import Calendar from "./Calendar";
import AnimeProgress from "./AnimeProgress";
import "./MainComponent.css"

function MainComponent() {
    return(
        <>
            <div className='main-div'>
                <div className="anime-progress-div">
                    <AnimeProgress/>
                </div>
                
                <div className="calendar-div">
                    <div className="settings-div">
                        <div className="left">
                            <h1>Month</h1>
                            <button>Prev Month</button>
                            <button>Next Month</button>
                        </div>
                        <div className="right">
                            <Settings/>
                        </div>
                    </div>
                    <Calendar/>
                </div>
            </div>
        </>
    );
}

export default MainComponent;