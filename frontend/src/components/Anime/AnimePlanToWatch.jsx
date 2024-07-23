import axios from "axios";
import CountDown from "./Countdown";

// Moves anime from plan to watch div into watching and updates status on MyAnimeList
const moveToWatchingDiv = ((anime,setTrigger, setGotRequest) => {
    setGotRequest(false);
    axios.post('/api/update-anime',
        {
            'anime-id': anime.id,
            'eps-watched': 0,
            'completed': false,
            'status': 'watching'
        }
    )
    .then(response => {
        setTrigger(x => x + 1);
        setGotRequest(true);
    })
    .catch(error => {
        if(error.response.status === 502) {
            setGotRequest(true);
            document.getElementById('popup-error-message').textContent = error.response.data;
            const popup = document.getElementById("error-popup");
            popup.classList.add("show-error");
            popup.classList.remove("hide-error");
            updateFeedback.style.display = "none";
            updateFeedback2.style.display = "flex";
        } else {
            axios.delete('/api/logout')
            .then(response => {
                localStorage.removeItem('username');
                localStorage.removeItem('pfp');
                localStorage.setItem('errorMsgDiv', true);
                document.cookie = 'session=; Max-Age=-99999999;';
                window.location.href = response.data.redirect_url;
            });
        }
    })
});

function AnimePlanToWatch({anime,setTrigger,setGotRequest}) {
    const air_status = anime.air_status;

    // if anime is currently airing
    if(air_status === "currently_airing") {
        return(
            <div className='plan-to-watch-anime-info-div'>
                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                    {anime.season !== null ?
                        <>
                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                        </>
                        :
                        null
                    }
                </p>
                <p className='episode-status'>
                    This anime is&nbsp;
                    <span style={{textDecoration: "underline", color: "var(--text)"}}>currently</span>
                    &nbsp;airing.
                </p>
                <div className='ptw-button-div'>
                    <button id={anime.id + 'ptw-button1'} className="positive-button add-to-watching-button"
                        onClick={(event) => {
                            event.target.style.display = "none";
                            const confirmButton = document.getElementById(anime.id+'ptw-button2');
                            confirmButton.style.display = "block";

                            const timeoutId = setTimeout(() => {
                                confirmButton.style.display = "none";
                                event.target.classList.add('bounce');
                                event.target.style.display = "block";
                            }, 3000);

                            confirmButton.timeoutId = timeoutId;
                        }}
                        >
                        Started Watching
                    </button>
                    <button id={anime.id + 'ptw-button2'} style={{display: 'none'}}className="positive-button add-to-watching-button"
                        onClick={(event) => {
                            clearTimeout(event.target.timeoutId);
                            moveToWatchingDiv(anime,setTrigger, setGotRequest);
                        }}
                        >
                        Confirm?
                    </button>
                </div>
            </div>
        );
    }

    else if (air_status === "not_yet_aired") {
        const start_date = anime.start_date;

        if(start_date) {
            const arr = start_date.split('-');

            // Release date is known
            if(arr.length === 3) {

                if(anime.broadcast_time) {
                    // Convert time to local time
                    const jstDateTimeStr = `${anime.start_date}T${anime.broadcast_time}:00+09:00`;
                    const jstDate = new Date(jstDateTimeStr);
                    const localDateTimeStr = jstDate.toLocaleString();

                    // Change into ISO 8601 format
                    const [date, time] = localDateTimeStr.split(',');
                    const [day,mth,yr] = date.trim().split('/');
                    const [hour,min,sec] = time.trim().split(":");
                    const isoTime = `${yr}-${mth}-${day}T${hour}:${min}:${sec}`;

                    // Get difference
                    const startDate = new Date(isoTime);
                    const dateNow = Date.now();
                    let diff = startDate - dateNow;
                    let days = Math.round(diff / (1000 * 60 * 60 * 24));

                    let startDateArr = startDate.toString().trim().split(' ');

                    if(days > 1) {
                        return(
                            <>
                                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </p>
                                <p className='episode-status'>
                                    This anime is set to release in&nbsp;
                                    <span className="white-bold">
                                        {days}&nbsp;
                                    </span>
                                    days on&nbsp;
                                    <span className='white-bold'>
                                        {startDateArr[2]} {startDateArr[1]} {startDateArr[3]}, {startDateArr[0]}
                                    </span>.<br/>
                                </p>
                            </>
                        );
                    } 
                    else if (days <= 1 && days >= 0) {
                        return(
                            <>
                                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </p>
                                <p className='episode-status'>
                                    This anime is set to release in&nbsp;
                                    <span className="white-bold">
                                        <CountDown timer={diff}/>&nbsp;
                                    </span>
                                    on&nbsp;
                                    <span className='white-bold'>
                                        {startDateArr[2]} {startDateArr[1]} {startDateArr[3]}, {startDateArr[0]}
                                    </span>.<br/>
                                </p>
                            </>
                        );
                    }
                } else {
                    // Convert JST to local time
                    const jstDate = new Date(anime.start_date);
                    const localDateTimeStr = jstDate.toLocaleString();

                    // Change into ISO 8601 format
                    const [date, time] = localDateTimeStr.split(',');
                    const [day,mth,yr] = date.trim().split('/');
                    const [hour,min,sec] = time.trim().split(":");
                    const isoTime = `${yr}-${mth}-${day}T${hour}:${min}:${sec}`;

                    const startDate = new Date(isoTime);
                    const dateNow = new Date(Date.now());
                    let diff = startDate - dateNow;
                    let days = Math.round(diff / (1000 * 60 * 60 * 24));

                    let releaseDate = startDate.toString().trim().split(' ');

                    if(days > 1) {
                        return(
                            <>
                                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                                    {anime.season !== null ?
                                        <>
                                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                        </>
                                        :
                                        <>
                                            TBD
                                        </>
                                    }
                                </p>
                                <p className='episode-status'>
                                    This anime is set to release in&nbsp;
                                    <span className="white-bold">
                                        {days}&nbsp;
                                    </span>
                                    days on&nbsp;
                                    <span className='white-bold'>
                                        {releaseDate[2]} {releaseDate[1]} {releaseDate[3]}, {releaseDate[0]}
                                    </span>.<br/>
                                </p>
                            </>
                        );
                    } else if (days <= 1 && days > 0) {
                        return(
                            <>
                                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                                    {anime.season !== null ?
                                        <>
                                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                        </>
                                        :
                                        <>
                                            TBD
                                        </>
                                    }
                                </p>
                                <p className='episode-status'>
                                    This anime is set to release&nbsp;
                                    <span className="white-bold">
                                        sometime today &nbsp;
                                    </span>
                                    on&nbsp;
                                    <span className='white-bold'>
                                        {releaseDate[2]} {releaseDate[1]} {releaseDate[3]}, {releaseDate[0]}
                                    </span>.<br/>
                                </p>
                            </>
                        );
                    } 
                }
            }
            // Only Release month and year is known
            else if(arr.length === 2) {
                const year = arr[0];
                const month = arr[1];
                return(
                    <>
                        <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                            {anime.season !== null ?
                                <>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </>
                                :
                                <>
                                    TBD
                                </>
                            }
                        </p>
                        <p className='episode-status'>
                            This anime is set to release sometime in <span className='white-bold'>{month} {year}</span>.
                        </p>
                    </>
                );
            }
            // Only release year is known
            else if (arr.length === 1) {
                const year = arr[0];
                return(
                    <>
                        <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                            {anime.season !== null ?
                                <>
                                    {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                                </>
                                :
                                <>
                                    TBD
                                </>
                            }
                        </p>
                        <p className='episode-status'>
                            This anime is set to release sometime in <span className='white-bold'>{year}</span>.
                        </p>
                    </>
                );
            }
        }
        

        return(
            <>
                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                    {anime.season !== null ?
                        <>
                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                        </>
                        :
                        <>
                            TBD
                        </>
                    }
                </p>
                <p className='episode-status'>
                    Release info is unknown.
                </p>
            </>
        );
    }

    // if anime is finished airing
    else if(air_status === "finished_airing") {
        return(
            <div className='plan-to-watch-anime-info-div'>
                <p className="progress-bar-text" style={{marginBottom: "4%"}}>
                    {anime.season !== null ?
                        <>
                            {anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}
                        </>
                        :
                        null
                    }
                </p>
                <p className='episode-status'>
                    This anime has&nbsp;
                    <span style={{textDecoration: 'underline', color: "var(--text)"}}>finished</span>
                    &nbsp;airing.
                </p>
                <div className='ptw-button-div'>
                    <button id={anime.id + 'ptw-button1'} className="positive-button add-to-watching-button"
                        onClick={(event) => {
                            event.target.style.display = "none";
                            const confirmButton = document.getElementById(anime.id+'ptw-button2');
                            confirmButton.style.display = "block";

                            const timeoutId = setTimeout(() => {
                                confirmButton.style.display = "none";
                                event.target.classList.add('bounce');
                                event.target.style.display = "block";
                            }, 3000);

                            confirmButton.timeoutId = timeoutId;
                        }}
                        >
                        Started Watching
                    </button>
                    <button id={anime.id + 'ptw-button2'} style={{display: 'none'}}className="positive-button add-to-watching-button"
                        onClick={(event) => {
                            clearTimeout(event.target.timeoutId);
                            moveToWatchingDiv(anime,setTrigger, setGotRequest);
                            setGotRequest(false);
                        }}
                        >
                        Confirm?
                    </button>
                </div>
            </div>
        );
    }
    // Should not be possible
    else {
        return(
            <p className='episode-status'>
                This anime does not have any info available.
            </p>
        );
    }
};

export default AnimePlanToWatch;