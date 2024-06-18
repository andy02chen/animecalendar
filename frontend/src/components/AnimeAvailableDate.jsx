import { useState, useEffect } from "react";
import axios from "axios";

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

// Updates the number of episodes watched on MyAnimeList
function updateStatus(anime, episodesWatched, setEpisodesWatched) {
    axios.post('/api/update-anime',
        {
            'anime-id': anime,
            'eps-watched': episodesWatched
        }
    )
    .then(response => {
        setEpisodesWatched(e => e + 1);
    })
    .catch(error => {
        console.log(error);
    });
}

function AnimeAvailableDate({anime}) {
    const [episodesWatched, setEpisodesWatched] = useState(anime.eps_watched);

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
    let nextEpDate = new Date(isoTime);
    let daysToAdd = 7 * episodesWatched;
    nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);
    
    // Gets days until next episode release
    const dateNow = Date.now();
    let diffMs = nextEpDate - dateNow;
    let days = diffMs / (1000 * 60 * 60 * 24);
    
    // Display information about next episode release
    let nextEpInfo = nextEpDate.toString().trim().split(' ');

    // Progress Bar style
    let progress = anime.eps === 0 ? 60: (episodesWatched / anime.eps) * 100;
    let styles = {
        width: "100%",
        border: "2px solid #666666",
        borderRadius: "25px",
        background: `linear-gradient(to right, 
                        hsla(120, 100%, 39%, 0.95) 0%,
                        hsla(120, 100%, 39%, 0.95) ${String(progress) + "%"},
                        hsla(0, 0%, 0%, 0.35) ${String(progress) + "%"},
                        hsla(0, 0%, 0%, 0.35) 100%)`
    }

    // When user watches an episode, it will update
    useEffect(() => {
        nextEpDate = new Date(isoTime);
        daysToAdd = 7 * episodesWatched;
        nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);

        diffMs = nextEpDate - Date.now();
        days = diffMs / (1000 * 60 * 60 * 24);
        
        nextEpInfo = nextEpDate.toString().trim().split(' ');

        progress = anime.eps === 0 ? 60: (episodesWatched / anime.eps) * 100;
        styles = {
            width: "100%",
            border: "2px solid #666666",
            borderRadius: "25px",
            background: `linear-gradient(to right, 
                            hsla(120, 100%, 39%, 0.95) 0%,
                            hsla(120, 100%, 39%, 0.95) ${String(progress) + "%"},
                            hsla(0, 0%, 0%, 0.35) ${String(progress) + "%"},
                            hsla(0, 0%, 0%, 0.35) 100%)`
        }
    }, [episodesWatched]);

    // Displays next episode status
    if(days >= 1) {
        return(
            <>
                <div style={styles}>
                    <p>{episodesWatched}/{anime.eps === 0 ? '?' : anime.eps}</p>                                    
                </div>
                <p>{`Ep. ${episodesWatched + 1} will be available in ${Math.ceil(days)} days on ${nextEpInfo[0]}, ${nextEpInfo.splice(1,3).join(' ')}`}</p>
            </>
        );
    // Countdown if within 24 hours
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
            <>
                <div style={styles}>
                    <p>{episodesWatched}/{anime.eps === 0 ? '?' : anime.eps}</p>                                    
                </div>
                <p>
                    {countdown > 0 ? 
                    `Ep. ${episodesWatched + 1} will be avaliable to watch in ${formatTime(countdown)}` :
                    `Ep. ${episodesWatched + 1} available to watch now`
                    }
                </p>
            </>
        );
    } else {
        return(
            <>
                <div style={styles}>
                    <p>{episodesWatched}/{anime.eps === 0 ? '?' : anime.eps}</p>                                    
                </div>
                <p>{`Ep. ${episodesWatched + 1} available to watch now`}</p>
                <button>Delayed</button>
                <button onClick={() => updateStatus(anime.id, episodesWatched, setEpisodesWatched)}>Watched</button>
            </>
        );
    }
}

export default AnimeAvailableDate;