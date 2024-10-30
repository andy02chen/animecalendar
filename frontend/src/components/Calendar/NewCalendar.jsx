import './NewCalendar.css';
import { useState, useEffect, useRef } from 'react';

function expandChangeMonths() {
    const div = document.getElementById('calendar-change-months');
    if(div.style.display === 'none') {
        div.style.display = 'grid';
    } else {
        div.style.display = 'none';
    }
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

// Changes the month displayed
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
    document.getElementById("calendar-change-months").style.display = 'none';
}

// Dates in day, month and year and creates a date string
function createDateString(day,month,year) {
    const dayString = String(day).padStart(2,'0');
    const monthString = String(month).padStart(2,'0');
    
    // return `${dayString}/${monthString}/${year}`;
    return `${year}-${monthString}-${dayString}`
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function NewCalendar({animeList, refresh}) {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];

    // Today
    const today = new Date();
    let day = today.getDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Which year to display
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    // Arrays to store prev, curr, and next month dates
    const [prevMonthDates, setPrevMonthDates] = useState([]);
    const [currMonthDates, setCurrMonthDates] = useState([]);
    const [nextMonthDates, setNextMonthDates] = useState([]);

    let startDate = 0;
    let endDate = 0;
    let prevMonthStart = 0;
    let prevMonthDate = 0
    let nextMonthDay = 0;
    let nextMonthStart = 0;

    // To store the dates and the episode releases
    // const markersMap = useRef(new Map());
    const [markersMap, setMarkersMap] = useState(new Map());

    // When the year changes need to empty the map
    useEffect(() => {
        // setMarkersMap(new Map());
        const tempMap = new Map();
        const startOfYear = new Date(`1/1/${year-1}`);

        if(animeList !== null) {

            // Loop through the store the releases the map
            for(const anime of animeList) {
                for(const dateString of anime.epsArray) {
                    const date = new Date(dateString);
                    const formattedDate = formatDate(date);

                    if(date >= startOfYear) {
                        if(tempMap.has(formattedDate)) {
                            const array = tempMap.get(formattedDate);
                            array.push(localStorage.getItem(anime.id+"Colour"));
                            tempMap.set(formattedDate, array);
                        } else {
                            tempMap.set(formattedDate, [localStorage.getItem(anime.id+'Colour')]);
                        }
                    }
                }
            }
        }

        setMarkersMap(tempMap);
    }, [animeList, refresh]);

    useEffect(() => {
        [startDate, endDate, prevMonthStart, 
            prevMonthDate, nextMonthStart, nextMonthDay] = getMonthDates(year, month);

        // Array of prev month dates
        const pushPrevMonth = [];

        let monthDateString;
        let yearDateString;

        if(prevMonthStart !== 6) {

            if(month === 0) {
                monthDateString = 12;
                yearDateString = year-1;
            } else {
                monthDateString = month;
                yearDateString = year;
            }

            for(let i = prevMonthDate - prevMonthStart; i <= prevMonthDate; i++) {
                const dateString = createDateString(i,monthDateString,yearDateString);

                const displayMarkers = markersMap.get(dateString);
                const arrPush = [];
                arrPush.push(i);
                if(displayMarkers) {
                    arrPush.push(displayMarkers);
                }

                pushPrevMonth.push(arrPush);
            }
        }

        // Array of curr month dates
        const pushCurrMonthDates = [];
        monthDateString = month+1;
        yearDateString = year;
        for(let i = startDate; i <= endDate; i++) {

            const dateString = createDateString(i,monthDateString,yearDateString);

            const displayMarkers = markersMap.get(dateString);
            const arrPush = [];
            arrPush.push(i);
            if(displayMarkers) {
                arrPush.push(displayMarkers);
            }

            pushCurrMonthDates.push(arrPush);
        }

        let lengthCalendar = pushPrevMonth.length + pushCurrMonthDates.length;

        // Array of next month dates
        const pushNextMonthDates = [];

        if(month === 11) {
            monthDateString = 1;
            yearDateString = year+1;
        } else {
            monthDateString = month+2;
            yearDateString = year;
        }
        
        for(let i = lengthCalendar; i < 42 ; i++) {
            const dateString = createDateString(nextMonthStart,monthDateString,yearDateString);

            const displayMarkers = markersMap.get(dateString);
            const arrPush = [];
            arrPush.push(nextMonthStart++);

            if(displayMarkers) {
                arrPush.push(displayMarkers);
            }
            pushNextMonthDates.push(arrPush);
        }

        setPrevMonthDates(pushPrevMonth);
        setCurrMonthDates(pushCurrMonthDates);
        setNextMonthDates(pushNextMonthDates);
        
    }, [month, markersMap, refresh]);

    document.addEventListener("click", function(event) {
        const div = document.getElementById('calendar-change-months');
        const monthClicked = document.getElementById('choose-month-div-opener');

        let isClickInside = div.contains(event.target) || monthClicked.contains(event.target);
    
        if (!isClickInside) {
            div.style.display = "none";
        }
    });

    return(
        <div className="calendar-container">
            <div>
                {/* SVG for mobile and tablets */}
                <svg className='calendar-svg-mobile' preserveAspectRatio='none' viewBox="0 0 350 991" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8585 0L0 30.1351V125.975L11.8585 168.46L0 199.089V991H134.106L144.22 966.793L154.5 991L164.101 966.793L175.959 991H350V679.769L342.85 651.61V466.353L349.826 443.628V0H304.136L291.579 30.1351H248.854L236.298 0L224.788 30.1351H110.563L100.623 0H11.8585Z" fill="#3FA4FF"/>
                <rect width="2.8501" height="3.11302" transform="matrix(-1 0.000102693 1.8167e-08 -1 344.777 966.073)" fill="#EBD8B3"/>
                <rect width="156.756" height="6.22604" transform="matrix(-1 0.000101685 -3.82847e-05 -1 339.076 967.631)" fill="#EBD8B3"/>
                <path d="M336.147 970.744L340.46 980.083L334.709 980.083L332.553 975.413L330.396 970.744L336.147 970.744Z" fill="#79BFFF"/>
                <path d="M327.527 970.744L331.84 980.083L326.089 980.083L323.933 975.413L321.776 970.744L327.527 970.744Z" fill="#79BFFF"/>
                <path d="M318.898 970.744L323.211 980.083L317.46 980.083L315.304 975.414L313.147 970.744L318.898 970.744Z" fill="#79BFFF"/>
                <ellipse cx="5.22725" cy="43.8434" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 43.8434)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="43.8434" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 43.8434)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000759895 4.81318e-08 -1 15.9004 59.5637)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="55.1623" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 55.1623)" fill="#EBD8B3"/>
                <ellipse cx="5.22725" cy="55.1623" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 55.1623)" fill="#EBD8B3"/>
                <ellipse cx="5.22725" cy="66.4843" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 66.4843)" fill="#EBD8B3"/>
                <ellipse cx="5.22725" cy="77.7997" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 77.7997)" fill="#EBD8B3"/>
                <ellipse cx="5.22725" cy="89.1102" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 89.1102)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="89.1102" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 89.1102)" fill="#EBD8B3"/>
                <ellipse cx="5.22725" cy="100.434" rx="1.73759" ry="4.40144" transform="rotate(-180 5.22725 100.434)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000594027 4.81318e-08 -1 6.96484 116.154)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000594027 4.81318e-08 -1 11.4316 116.154)" fill="#EBD8B3"/>
                <ellipse cx="1.7376" cy="4.40144" rx="1.7376" ry="4.40144" transform="matrix(-0.999996 -0.00281009 4.81319e-08 -1 15.9004 116.154)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000231331 4.81315e-08 -1 15.9004 104.833)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="100.432" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 100.432)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000181554 4.81314e-08 -1 15.9004 93.516)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000614364 4.81318e-08 -1 15.9004 82.2061)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="66.4843" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 66.4843)" fill="#EBD8B3"/>
                <ellipse cx="9.69405" cy="77.7997" rx="1.73759" ry="4.40144" transform="rotate(-180 9.69405 77.7997)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000227052 4.81315e-08 -1 15.9004 70.8857)" fill="#EBD8B3"/>
                <ellipse cx="1.73759" cy="4.40144" rx="1.73759" ry="4.40144" transform="matrix(-1 -0.000226831 4.81315e-08 -1 15.9004 48.2461)" fill="#EBD8B3"/>
                <path d="M205.503 5.72205e-05L194.87 27.6096H223.979L234.611 5.72205e-05H205.503Z" fill="#6A7378"/>
                <path d="M173.431 5.72205e-05L162.799 27.6096H191.907L202.54 5.72205e-05H173.431Z" fill="#7A848A"/>
                <path d="M141.359 5.72205e-05L130.727 27.6096H159.835L170.468 5.72205e-05H141.359Z" fill="#AEBCC5"/>
                <path d="M330.477 21.62L334.188 13.8047L334.187 295.155L330.477 302.97L330.477 21.62Z" fill="#AEBCC5"/>
                <rect width="22.6793" height="8.71514" transform="matrix(-1.54535e-08 1 -1 3.78563e-06 344.771 13.8047)" fill="#E2C893"/>
                <rect x="341.26" y="126.681" width="289.434" height="2.65153" transform="rotate(90 341.26 126.681)" fill="#A0D2FF"/>
                <path d="M17.4307 184.392L5.22949 223.084V540.358L17.4307 512.5V184.392Z" fill="#7A848A"/>
                <path d="M108.94 982.605L103.188 957.953H23.0082L12.5501 930.837V710.946L3.48633 685.802V946.12L15.6875 982.605H108.94Z" fill="#F1F3F2"/>
                </svg>

                {/* SVG for desktops */}
                <svg className='calendar-svg-pc' preserveAspectRatio='none' viewBox="0 0 1005 1004" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_557_688" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="-1" width="1006" height="1006">
                <path d="M7.79792 34.7455L27.1458 5.06705H146.894L168.333 34.7455L321.548 32.7546L332.529 18.0966H424.562H436.067H489.927L498.817 34.7455L509.275 18.0966L519.21 34.7455L530.192 18.0966H540.65L551.108 0H661.967L682.883 34.7455H980.946L1005 55.0137V220.779L991.404 233.808V293.889L980.946 315.605V366.999V639.172L991.404 655.097L980.946 671.022L991.404 686.224L980.946 702.149L991.404 717.35L980.946 731.827V828.101L998.725 859.951V966.359H980.946V988.075L970.487 1004H950.617L937.544 988.075H887.344H838.713H427.177H403.646H392.142H373.84L362.858 975.769L352.4 988.075L341.942 975.769L332.006 988.075H290.696H278.146H269.256H247.817L237.881 975.769H134.344L111.335 1004H28.7146L11.9812 975.769V916.412V901.211V859.951V843.075V828.825H1V815.795V777.43H7.79792V731.02V699.822V625.373V578.576V432.514V383.59V311.268V291.231V275.566V247.796V229.994V135.291L18.2563 120.338L7.79792 107.521V79.0383V60.8046V34.7455Z" fill="#79BFFF"/>
                <path d="M7.79792 34.7455L27.1458 5.06705H146.894L168.333 34.7455L321.548 32.7546L332.529 18.0966H424.562H436.067H489.927L498.817 34.7455L509.275 18.0966L519.21 34.7455L530.192 18.0966H540.65L551.108 0H661.967L682.883 34.7455H980.946L1005 55.0137V220.779L991.404 233.808V293.889L980.946 315.605V220.779L998.725 204.13V62.9762L980.946 47.7751V366.999V639.172L991.404 655.097L980.946 671.022L991.404 686.224L980.946 702.149L991.404 717.35L980.946 731.827V828.101L998.725 859.951V966.359H980.946V988.075L970.487 1004H950.617L937.544 988.075H887.344H838.713H427.177H403.646H392.142H373.84L362.858 975.769L352.4 988.075L341.942 975.769L332.006 988.075H290.696H278.146H269.256H247.817L237.881 975.769H134.344L111.335 1004H28.7146L11.9812 975.769V916.412V901.211V859.951V843.075V828.825H1V815.795V777.43H7.79792V731.02V699.822V625.373V578.576V432.514V383.59V311.268V291.231V275.566V247.796V229.994V135.291L18.2563 120.338L7.79792 107.521V79.0383V60.8046V34.7455Z" stroke="black"/>
                </mask>
                <g mask="url(#mask0_557_688)">
                <rect x="-3.18262" width="1008.18" height="1003.28" fill="#3FA4FF"/>
                </g>
                <rect x="736.226" y="967.435" width="5.21082" height="3.15702" transform="rotate(-180 736.226 967.435)" fill="#EBD8B3"/>
                <rect width="286.595" height="6.31405" transform="matrix(-1 -1.36911e-07 -6.9011e-05 -1 725.803 969.014)" fill="#EBD8B3"/>
                <path d="M720.447 972.172L728.332 981.643L717.818 981.643L713.875 976.908L709.933 972.172L720.447 972.172Z" fill="#79BFFF"/>
                <path d="M704.686 972.172L712.571 981.643L702.057 981.643L698.115 976.908L694.172 972.172L704.686 972.172Z" fill="#79BFFF"/>
                <path d="M688.911 972.172L696.797 981.643L686.283 981.643L682.34 976.908L678.398 972.172L688.911 972.172Z" fill="#79BFFF"/>
                <path d="M169.382 29.9043L151.603 5.69434H169.382L187.161 29.9043H169.382Z" fill="#D0D8DD"/>
                <path d="M192.39 29.9043L174.611 5.69434H192.39L210.17 29.9043H192.39Z" fill="#BCC7CF"/>
                <path d="M214.351 29.9043L196.572 5.69434H214.351L232.131 29.9043H214.351Z" fill="#7A848A"/>
                <path d="M236.312 29.9043L218.533 5.69434H236.312L254.092 29.9043H236.312Z" fill="#6A7378"/>
                <path d="M998.728 172.318L998.728 217.89L987.747 230.707L987.747 292.656L980.949 278.414L980.949 220.738L980.949 196.528L998.728 172.318Z" fill="#E8F4FF"/>
                <path d="M686.438 23.0678L680.79 17.0892H884.115L889.763 23.0678H686.438Z" fill="#AEBCC5"/>
                <rect x="680.79" width="10.4583" height="14.2411" fill="#E2C893"/>
                <rect x="762.363" y="5.69434" width="209.167" height="4.27234" fill="#A0D2FF"/>
                <ellipse cx="990.883" cy="952.019" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="952.019" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="939.202" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="939.202" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="939.202" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="926.385" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="913.569" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="900.752" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="900.752" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="887.935" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="990.883" cy="875.117" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="875.118" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="875.117" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="887.935" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="887.935" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="900.752" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="913.569" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="926.385" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="981.472" cy="913.569" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="926.385" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="972.058" cy="952.02" rx="3.66042" ry="4.9844" fill="#EBD8B3"/>
                <ellipse cx="38.1238" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 38.1238 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="38.1238" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 38.1238 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="47.5368" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 47.5368 16.378)" fill="#EBD8B3"/>
                <ellipse cx="47.5368" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 47.5368 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="47.5368" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 47.5368 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="56.9529" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 56.9529 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="66.363" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 66.363 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="75.7693" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 75.7693 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="75.7693" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 75.7693 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="85.1863" cy="42.0114" rx="4.9844" ry="3.66042" transform="rotate(90 85.1863 42.0114)" fill="#EBD8B3"/>
                <ellipse cx="4.9844" cy="3.66042" rx="4.9844" ry="3.66042" transform="matrix(-0.00020408 1 -1 -7.44019e-08 98.2598 37.027)" fill="#EBD8B3"/>
                <ellipse cx="4.9844" cy="3.66042" rx="4.9844" ry="3.66042" transform="matrix(-0.00020408 1 -1 -7.44019e-08 98.2598 24.2113)" fill="#EBD8B3"/>
                <ellipse cx="4.9844" cy="3.66042" rx="4.9844" ry="3.66042" transform="matrix(-0.00016387 1 -1 -7.44018e-08 98.2598 11.3936)" fill="#EBD8B3"/>
                <ellipse cx="85.1853" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 85.1853 16.378)" fill="#EBD8B3"/>
                <ellipse cx="85.1853" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 85.1853 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="75.7732" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 75.7732 16.378)" fill="#EBD8B3"/>
                <ellipse cx="66.3669" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 66.3669 16.378)" fill="#EBD8B3"/>
                <ellipse cx="56.9529" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 56.9529 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="66.363" cy="29.1957" rx="4.9844" ry="3.66042" transform="rotate(90 66.363 29.1957)" fill="#EBD8B3"/>
                <ellipse cx="56.9529" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 56.9529 16.378)" fill="#EBD8B3"/>
                <ellipse cx="38.1247" cy="16.378" rx="4.9844" ry="3.66042" transform="rotate(90 38.1247 16.378)" fill="#EBD8B3"/>
                <path d="M25.0535 119.625L13.0264 137.427V283.398L25.0535 270.581V119.625Z" fill="#7A848A"/>
                <path d="M5.70117 820.289V786.823H17.7283L27.0134 798.511V963.316L37.7268 979.176H105.578L125.475 957.004H220.365L234.14 970.533H134.658L111.7 998.484H30.2783L15.2797 974.349V820.289H5.70117Z" fill="#F1F3F2"/>
                </svg>
                <div className='calendar-page-main'>
                    <div className='calendar-month-header'>
                        <div className='calendar-month-header-month-div'>
                            <h1 className='month-year-calendar' id='choose-month-div-opener'
                            onClick={() => expandChangeMonths()}>{months[month]} {year}</h1>
                                <div id='calendar-change-months' style={{display: 'none'}}>
                                    {months.map((month, index) => (
                                        <p className='change-div-months-buttons' key={index}
                                        onClick={() => displaySelectedMonth(index, setMonth)}>
                                            {month}
                                        </p>
                                    ))}
                                </div>
                        </div>
                        <div className='calendar-month-header-buttons-div'>
                            <button className='today-button'
                            onClick={() => {setMonth(todayMonth); setYear(todayYear);}}>Today</button>
                            <button className='change-month-button'
                            onClick={() => displayPrevMonth(month, year, setMonth, setYear)}>
                                <svg className="prev-month-button-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                            </button>
                            <button className='change-month-button'
                            onClick={() => displayNextMonth(month, year, setMonth, setYear)}>
                                <svg className="next-month-button-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                            </button>
                        </div>
                    </div>
                    <div className='calendar-dates-div'>
                        <div className='calendar-days-of-week'>
                            {daysOfWeek.map((day, index) => 
                                <li key={index}>
                                    <h1 className='calendar-day-title'>{day}</h1>
                                </li>
                            )}
                        </div>
                        <div className='calendar-dates-on-calendar'>
                            <ul className='dates-list'>
                                {prevMonthDates.map((date, index) => 
                                    <li key={index} className='inactive-date'>
                                        <div>
                                            {date.length === 1 ?
                                                <p>{date[0]}</p>
                                                :
                                                <>
                                                    <p>
                                                        {date[0]}
                                                    </p>
                                                    <div className='calendar-marker-div'>
                                                        {date[1].map((color, index) =>
                                                            <div key={index} className='calendar-date-marker' style={{backgroundColor: `${color}`}}></div>
                                                        )}
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </li>
                                )}
                                {currMonthDates.map((date, index) => 
                                    <li key={index} className={date[0] === todayDay && month === todayMonth & year === todayYear ? "today": null}>
                                        <div>
                                            {date.length === 1 ?
                                                <p>{date[0]}</p>
                                                :
                                                <>
                                                    <p>
                                                        {date[0]}
                                                    </p>
                                                    <div className='calendar-marker-div'>
                                                        {date[1].map((color, index) =>
                                                            <div key={index} className='calendar-date-marker' style={{backgroundColor: `${color}`}}></div>
                                                        )}
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </li>
                                )}
                                {nextMonthDates.map((date, index) => 
                                    <li key={index} className='inactive-date'>
                                        <div>
                                            {date.length === 1 ?
                                                <p>{date[0]}</p>
                                                :
                                                <>
                                                    <p>
                                                        {date[0]}
                                                    </p>
                                                    <div className='calendar-marker-div'>
                                                        {date[1].map((color, index) =>
                                                            <div key={index} className='calendar-date-marker' style={{backgroundColor: `${color}`}}></div>
                                                        )}
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewCalendar;