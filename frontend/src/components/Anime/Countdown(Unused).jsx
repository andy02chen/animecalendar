import { useEffect, useState } from "react";

// Formats the time into HH:MM:SS
function formatTime(timeRemaining) {
    let hours = Math.floor(timeRemaining / (1000*60*60));
    let mins = Math.floor(timeRemaining / (1000*60) % 60);
    let sec = Math.floor(timeRemaining / (1000) % 60);
    hours = String(hours).padStart(2, '0')
    mins = String(mins).padStart(2, '0')
    sec = String(sec).padStart(2, '0')
    return `${hours >= 1 ? hours+":" : ""}${mins >= 1 || hours >= 0 ? mins+":" : ""}${sec}`;
}

function CountDown({timer}) {
    const [countdown, setCountdown] = useState(timer);
    
    let hours = Math.floor(timer / (1000*60*60));
    let mins = Math.floor(timer / (1000*60) % 60);
    let sec = Math.floor(timer / (1000) % 60);
    hours = String(hours).padStart(2, '0');
    mins = String(mins).padStart(2, '0');
    sec = String(sec).padStart(2, '0');

    useEffect(() => {
        if(countdown <= 0) return;

        const intervalId = setInterval(() => {
            setCountdown(c => c - 1000);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [countdown]);

    return formatTime(countdown);
}

export default CountDown;