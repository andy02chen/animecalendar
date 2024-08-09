import './Calendar.css'
import { useState, useEffect, useRef } from 'react';

function displayPrevMonth(month, year, setMonth, setYear) {
    if(month === 0) {
        setMonth(11);
        setYear(y => y - 1);
    } else {
        setMonth(m => m - 1)
    }
}

function displayNextMonth(month, year, setMonth, setYear) {
    if(month === 11) {
        setMonth(0);
        setYear(y => y + 1);
    } else {
        setMonth(m => m + 1)
    }
}

function displaySelectedMonth(month, setMonth) {
    setMonth(month);
    document.getElementById("change-month-div").style.display = 'none';
}

// Get the month start and end dates
function getMonthDates(year, month) {
    // Get start dates
    let startDate = new Date(year, month, 1).getDate();
    let endDate = new Date(year, month + 1, 0).getDate();

    // Get Prev Month End
    let prevMonthStart = new Date(year, month, 0).getDay();
    let prevMonthDate = new Date(year, month, 0).getDate();

    // Get Next Month Start
    let nextMonthStart = new Date(year, month + 1, 1).getDate();
    let nextMonthDay = new Date(year, month + 1, 1).getDay();

    let returnArr = [startDate, endDate, prevMonthStart, 
        prevMonthDate, nextMonthStart, nextMonthDay];

    return returnArr;
}

function displayMonthSelection() {
    const div = document.getElementById("change-month-div");

    if(div.style.display === 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
}

function Calendar({animeData}) {
    console.log(animeData);

    // Store all 366 days of the year
    const markers = new Array(366).fill(null);

    // Loop through all anime and store for this year


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

    // When month selection div is expanded but user clicks elsewhere
    document.addEventListener("click", function(event) {
        const div = document.getElementById('change-month-div');
        const monthClicked = document.getElementById('choose-month-div-opener');

        let isClickInside = div.contains(event.target) || monthClicked.contains(event.target);
    
        if (!isClickInside) {
            div.style.display = "none";
        }
    });

    // Today's Date
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [isLoading, setIsLoading] = useState(true);

    // let year = today.getFullYear();
    // let month = today.getMonth();
    let day = today.getDate();

    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    let startDate = 0;
    let endDate = 0;
    let prevMonthStart = 0;
    let prevMonthDate = 0
    let nextMonthDay = 0;
    let nextMonthStart = 0;

    const inactiveDays = useRef([]);
    const currMonthDates = useRef([]);
    const nextMonthDates = useRef([]);

    useEffect(() => {
        [startDate, endDate, prevMonthStart, 
            prevMonthDate, nextMonthStart, nextMonthDay] = getMonthDates(year, month);

        // Array of prev month dates
        inactiveDays.current = [];
        if(prevMonthStart !== 6) {
            for(let i = prevMonthDate - prevMonthStart; i <= prevMonthDate; i++) {
                inactiveDays.current.push(i);
            }
        }

        // Array of curr month dates
        currMonthDates.current = [];
        for(let i = startDate; i <= endDate; i++) {
            currMonthDates.current.push(i);
        }

        let lengthCalendar = inactiveDays.current.length + currMonthDates.current.length;

        // Array of next month dates
        nextMonthDates.current = [];
        for(let i = lengthCalendar; i < 42 ; i++) {
            nextMonthDates.current.push(nextMonthStart++);
        }

        setIsLoading(false);
    }, [month]);

    return(
        <>
            <div className="month-div">
                <div className='month-display-div'>
                    <div >
                        <h1 id='choose-month-div-opener' className="month-heading unselectable"
                        onClick={() => displayMonthSelection()}
                        >
                            {months[month]} {year}
                        </h1>
                    </div>
                    <div id='change-month-div' style={{display: 'none'}}>
                        <ul>
                            {months.map((monthInList, index) => 
                                <li key={index} className='unselectable'>
                                    <h3 className='month-selection-heading'
                                    onClick={() => displaySelectedMonth(index, setMonth)}>
                                        {monthInList}
                                    </h3>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div>
                </div>
                <div className='month-buttons-div'>
                    <button onClick={() => {setMonth(todayMonth); setYear(todayYear);}}>
                        Today
                    </button>
                    <button className="prev-month-button"
                        onClick={() => displayPrevMonth(month, year, setMonth, setYear)}>
                        <svg className="prev-month-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    </button>
                    <button className="next-month-button"
                        onClick={() => displayNextMonth(month, year, setMonth, setYear)}>
                        <svg className="next-month-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                    </button>
                </div>
            </div>
            <div className='calendar-main'>
                <div>
                    {isLoading ?
                    <>
                        <div className='loading-div'>
                            <svg className='loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
                            <p className='message-text'>Loading...</p>
                        </div>
                    </>
                    :
                        <>
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
                                    {inactiveDays.current.map((date, index) => 
                                        <li key={index} className='inactive-date'>
                                            <div>
                                                <p>{date}</p>
                                            </div>
                                        </li>
                                    )}
                                    {currMonthDates.current.map((date, index) => 
                                        <li key={index} className={date === todayDay && month === todayMonth & year === todayYear ? "today": null}>
                                            <div>
                                                <p>{date}</p>
                                            </div>
                                        </li>
                                    )}
                                    {nextMonthDates.current.map((date, index) => 
                                        <li key={index} className='inactive-date'>
                                            <div>
                                                <p>{date}</p>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default Calendar;