import NewCalendar from '../Calendar/NewCalendar';
import ProgressContainer from '../Progress/ProgressContainer';
import Feedback from '../MenuPages/Feedback';

function CalendarPage() {

    return(
        <>
            <ProgressContainer/>
            <NewCalendar/>
            <Feedback/>
        </>
    );
}

export default CalendarPage;