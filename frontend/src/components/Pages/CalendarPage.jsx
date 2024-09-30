import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';
import Tutorial from '../MenuPages/Tutorial';

function CalendarPage() {

    return(
        <>
            <ProgressContainer/>
            <NewCalendar/>
            <Feedback/>
            <Tutorial/>
        </>
    );
}

export default CalendarPage;