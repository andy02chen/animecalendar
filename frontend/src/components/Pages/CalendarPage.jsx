import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';
import Tutorial from '../MenuPages/Tutorial';
import Popup from '../Alert/Popup';
import Settings from '../MenuPages/Settings';
import './CalendarPage.css';
import { createContext, useState, useEffect } from 'react';
import CalendarError from '../Alert/CalendarError';

export const AnimeContext = createContext([]);

function CalendarPage() {
    const [watchingList, setWatchingList] = useState(null);
    const [planToWatchList, setPlanToWatchList] = useState(null);
    const [displayError, setDisplayError] = useState(false);

    const handleSuccess = (watching, planToWatch) => {
        setWatchingList(watching);
        setPlanToWatchList(planToWatch);
    };

    const addToWatching = (toAdd) => {
        setWatchingList(w => [...w, toAdd])
    }

    const removeFromPlanToWatch = (toRemove) => {
        setPlanToWatchList(list => {
            return list.filter(anime => anime.id !== toRemove)
        })
    }

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);

    return(
        <>
            <Popup/>
            <div className='app-main'>
                <AnimeContext.Provider value ={{handleSuccess, watchingList, planToWatchList, setDisplayError, addToWatching, removeFromPlanToWatch}}>
                    <ProgressContainer/>
                </AnimeContext.Provider>
                <NewCalendar/>
            </div>
            <Feedback/>
            <Tutorial/>
            <Settings watchingList={watchingList}/>
            <CalendarError displayError={displayError}/>
        </>
    );
}

export default CalendarPage;