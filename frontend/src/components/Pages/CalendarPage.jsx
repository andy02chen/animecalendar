import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';
import Tutorial from '../MenuPages/Tutorial';
import Popup from '../Alert/Popup';
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

    return(
        <>
            <Popup/>
            <div className='app-main'>
                <AnimeContext.Provider value ={{handleSuccess, watchingList, planToWatchList, setDisplayError}}>
                    <ProgressContainer/>
                </AnimeContext.Provider>
                <NewCalendar/>
            </div>
            <Feedback/>
            <Tutorial/>
            <CalendarError displayError={displayError}/>
        </>
    );
}

export default CalendarPage;