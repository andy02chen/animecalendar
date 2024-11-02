
import './ExpandDate.css';
import { useState } from 'react';

function createDateString(day,month,year) {
    const dayString = String(day).padStart(2,'0');
    const monthString = String(month).padStart(2,'0');
    
    // return `${dayString}/${monthString}/${year}`;
    return `${year}-${monthString}-${dayString}`
}

function ExpandDate({animeDictonary, dateDisplay, markersMap}) {
    const closeExpand = () => {
        const div = document.getElementById('expand-date');
        div.style.display = 'none'
    }

    const date = dateDisplay ? dateDisplay.split('-') : null;

    const markers= markersMap.get(dateDisplay);

    const sortedMarkers = markers.slice().sort((a, b) => {
        const today = new Date().toISOString().split("T")[0];
    
        // Convert JST times to Date objects for comparison
        const aJstTime = `${today}T${animeDictonary[a].jstTime}+09:00`;
        const bJstTime = `${today}T${animeDictonary[b].jstTime}+09:00`;
    
        return new Date(aJstTime) - new Date(bJstTime);
    });

    return(
        <div id='expand-date'>
            <div className='date-info'>
                <div className='date-header'>
                    <h1>
                        {date === null ? null : `${date[2]}-${date[1]}-${date[0]}`}
                    </h1>
                    <h1 className='menu-page-close-button' onClick={() => closeExpand()}>&#10006;</h1>
                </div>
                <div className='date-body'>
                    <div>
                        {markers === undefined ?
                            <h2>There are no episodes releasing today</h2>
                            :
                            sortedMarkers.map((id, index) => {
                                const jstTimeOnly = animeDictonary[id].broadcast_time;
                                const today = new Date().toISOString().split("T")[0];
                                const jstDateTimeString = `${today}T${jstTimeOnly}+09:00`;
                                const jstDate = new Date(jstDateTimeString);
                                const localTime = jstDate.toLocaleTimeString();
                            
                                return (
                                    <h2 key={index}>
                                        <span className='expand-date-time'>{localTime}</span> - {animeDictonary[id].title}
                                    </h2>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpandDate;