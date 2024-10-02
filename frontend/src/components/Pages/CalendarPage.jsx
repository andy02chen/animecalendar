import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';
import Tutorial from '../MenuPages/Tutorial';
import Popup from '../Alert/Popup';
import './CalendarPage.css';

function CalendarPage() {

    return(
        <>
            <Popup/>
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