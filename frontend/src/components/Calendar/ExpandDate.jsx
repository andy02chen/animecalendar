
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
    const [markers, setMarkers] = useState(markersMap.get(dateDisplay));
    console.log(markers);

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
                    {markers === undefined ?
                        <p>There are not anime</p>
                        :
                        <p>assd</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default ExpandDate;