import { useState, useEffect } from "react";

// Formats the time into HH:MM:SS
function formatTime(timeRemaining) {
    let hours = Math.floor(timeRemaining / (1000*60*60));
    let mins = Math.floor(timeRemaining / (1000*60) % 60);
    let sec = Math.floor(timeRemaining / (1000) % 60);
    hours = String(hours).padStart(2, '0')
    mins = String(mins).padStart(2, '0')
    sec = String(sec).padStart(2, '0')
    return `${hours > 0 ? hours : ""}:${mins > 0 ? mins : ""}:${sec}`;
}

function AnimeAvailableDate({anime}) {
    // Get anime broadcast date and time
    // Then convert it to local time
    const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
    const jstDate = new Date(jstDateTimeStr);
    const localDateTimeStr = jstDate.toLocaleString();

    // Change into ISO 8601 format
    const [date, time] = localDateTimeStr.split(',');
    const [day,mth,yr] = date.trim().split('/');
    const [hour,min,sec] = time.trim().split(":");
    const isoTime = `${yr}-${mth}-${day}T${hour}:${min}:${sec}`;

    // Get next episode date
    const nextEpDate = new Date(isoTime);
    let daysToAdd = 7 * anime.eps_watched;
    nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);
    
    // Gets days until next episode release
    const dateNow = Date.now();
    let diffMs = nextEpDate - dateNow;
    let days = diffMs / (1000 * 60 * 60 * 24);
    
    // Display information about next episode release
    const nextEpInfo = nextEpDate.toString().trim().split(' ');
    if(days >= 1) {
        return(
            <p>{`Ep. ${anime.eps_watched + 1} will be available in ${Math.ceil(days)} days on ${nextEpInfo.splice(0,4).join(' ')}`}</p>
        );
    } else if (days < 1 && days >= 0) {
        const [countdown, setCountdown] = useState(diffMs);

        useEffect(() => {
            if(countdown <= 0) return;

            const intervalId = setInterval(() => {
                setCountdown(c => c - 1000);
            }, 1000);

            return () => clearInterval(intervalId);
        }, [countdown]);

        return(
            <p>
                {countdown > 0 ? 
                `Ep. ${anime.eps_watched + 1} will be avaiable at ${formatTime(countdown)} time` :
                `Ep. ${anime.eps_watched + 1} available to watch now`
                }
            </p>
        );
    } else {
        return(
            <p>{`Ep. ${anime.eps_watched + 1} available to watch now`}</p>
        );
    }
}

export default AnimeAvailableDate;