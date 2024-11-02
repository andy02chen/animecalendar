
import './ExpandDate.css';
import { useState } from 'react';

function createDateString(day,month,year) {
    const dayString = String(day).padStart(2,'0');
    const monthString = String(month).padStart(2,'0');
    
    return `${year}-${monthString}-${dayString}`
}

function getEpisodeNumber(anime, clicked_date) {
    const differenceInMilliseconds = new Date(clicked_date) - new Date(anime.start_date);
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksDifference = Math.floor(differenceInMilliseconds / millisecondsPerWeek);
    const weeksEarly = Number(anime.early);

    if(weeksEarly > 0 && weeksDifference === 0) {
        return `1 - ${weeksDifference + 1 + weeksEarly}`;
    }

    // Add 1 because starting week has 0 difference
    return weeksDifference + 1 + weeksEarly;
}

function ExpandDate({animeDictonary, dateDisplay, markersMap}) {
    const closeExpand = () => {
        const div = document.getElementById('expand-date');
        div.style.display = 'none'
    }

    const date = dateDisplay ? dateDisplay.split('-') : null;

    const markers= [... new Set(markersMap.get(dateDisplay))];

    return(
        <div id='expand-date' style={{display: 'none'}}>
            <div className='date-info'>
                <div className='date-header'>
                    <h1>
                        {date === null ? null : `Estimated releases for ${date[2]}-${date[1]}-${date[0]}`}
                    </h1>
                    <h1 className='menu-page-close-button' onClick={() => closeExpand()}>&#10006;</h1>
                </div>
                <div className='date-body'>
                    <div>
                        {markers === undefined ?
                            <h2>There are no episodes releasing</h2>
                            :
                            markers
                            .map((id) => {
                                const jstTimeOnly = animeDictonary[id].broadcast_time;
                                const today = new Date().toISOString().split("T")[0];
                                const jstDateTimeString = `${today}T${jstTimeOnly}+09:00`;
                                const jstDate = new Date(jstDateTimeString);
                                const localTime = jstDate.toLocaleTimeString();

                                return {
                                    id,
                                    title: animeDictonary[id].title,
                                    localTime,
                                    jstDate,
                                    start_date: animeDictonary[id].start_date,
                                    early: localStorage.getItem(animeDictonary[id].id+"early")
                                };
                            })
                            .sort((a, b) => a.jstDate - b.jstDate)
                            .map((anime) => (
                                <h2 key={anime.id}>
                                    <span className='expand-date-time'>{anime.localTime}</span> - {anime.title} (Ep. {getEpisodeNumber(anime, dateDisplay)})
                                </h2>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpandDate;