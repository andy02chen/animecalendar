import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';
import Tutorial from '../MenuPages/Tutorial';
import './CalendarPage.css';

function CalendarPage() {

    return(
        <>
            <div className='app-main'>
                <ProgressContainer/>
                <NewCalendar/>
            </div>
            <Feedback/>
            <Tutorial/>
        </>
    );
}

export default CalendarPage;