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
                        <button>◀️</button>
                        <h1 className="title">Month</h1>
                        <button>▶️</button>
                    </div>
                    <Calendar/>
                </div>
            </div>
        </>
    );
}

export default MainComponent;