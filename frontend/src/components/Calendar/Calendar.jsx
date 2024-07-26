import './Calendar.css'
import './Month.css';

function Calendar() {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Today's Date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Get start dates
    const startDate = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();

    // Get Prev Month End
    const prevMonthStart = new Date(year, month, 0).getDay();
    let prevMonthDate = new Date(year, month, 0).getDate();

    // Get Next Month Start
    let nextMonthStart = new Date(year, month + 1, 1).getDate();
    const nextMonthDay = new Date(year, month + 1, 1).getDay();
    console.log(nextMonthStart, nextMonthDay);

    // Array of prev month dates
    const inactiveDays = [];
    for(let i = prevMonthStart; i < startDate; i++) {
        inactiveDays.push(prevMonthDate++);
    }

    // Array of curr month dates
    const currMonthDates = [];
    for(let i = startDate; i <= endDate; i++) {
        currMonthDates.push(i);
    }

    // Array of next month dates
    const nextMonthDates = [];
    for(let i = nextMonthDay; i < 7; i++) {
        nextMonthDates.push(nextMonthStart++);
    }

    return(
        <>
            <div className="month-div">
                <div className='month-display-div'>
                <button className="prev-month-button">
                    <svg className="prev-month-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                </button>
                <div>
                    <h1 className="month-heading unselectable">{months[month]} {year}</h1>
                </div>
                <button className="next-month-button">
                    <svg className="next-month-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                </button>
            </div>
            </div>
            <div className='calendar-main'>
                <div>
                    <div className='days-div'>
                        <ul className='days-of-week'>
                            {daysOfWeek.map((day, index) => 
                                <li key={index}>
                                    <h1 className='day-title'>{day}</h1>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className='dates-div'>
                        <ul className='dates-list'>
                            {inactiveDays.map((date, index) => 
                                <li key={index} className='inactive-date'>
                                    <div>
                                        <p>{date}</p>
                                    </div>
                                </li>
                            )}
                            {currMonthDates.map((date, index) => 
                                <li key={index} className={date === day ? "today": null}>
                                    <div>
                                        <p>{date}</p>
                                    </div>
                                </li>
                            )}
                            {nextMonthDates.map((date, index) => 
                                <li key={index} className='inactive-date'>
                                    <div>
                                        <p>{date}</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Calendar;