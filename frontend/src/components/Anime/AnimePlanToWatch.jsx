import axios from "axios";

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
                <p className='episode-status'>
                {anime.season !== null ? 
                    <>
                        <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                    </>
                : 
                    null
                }
                This anime is currently airing.
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

    // TODO add more info for not yet aired anime with start day available
    // if anime is not yet aired
    else if (air_status === "not_yet_aired") {
        const start_date = anime.start_date;

        if(start_date) {
            const arr = start_date.split('-');

            // Release date is known
            // TODO if broadcast time is available
            if(arr.length === 3) {
                const year = arr[0];
                const month = arr[1];
                const day = arr[2];

                // Convert JST to local time
                const jstDate = new Date(start_date);
                const localDateTimeStr = new Date(jstDate.toLocaleString());
                let releaseDate = localDateTimeStr.toString().trim().split(' ');

                return(
                    <p className='episode-status'>
                        {anime.season !== null ?
                            <>
                                <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                            </>
                            :
                            <>
                                <span className='white-bold'>TBD</span><br/>
                            </>
                        }
                        This anime is set to release on&nbsp;
                        <span className='white-bold'>
                            {releaseDate[2]} {releaseDate[1]}  {releaseDate[3]}, {releaseDate[0]}
                        </span>.<br/>
                    </p>
                );
            }
            // Only Release month and year is known
            else if(arr.length === 2) {
                const year = arr[0];
                const month = arr[1];
                return(
                    <p className='episode-status'>
                        {anime.season !== null ?
                            <>
                                <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                            </>
                            :
                            <>
                                <span className='white-bold'>TBD</span><br/>
                            </>
                        }
                        This anime is set to release sometime in <span className='white-bold'>{month} {year}</span>.
                    </p>
                );
            }
            // Only release year is known
            else if (arr.length === 1) {
                const year = arr[0];
                return(
                    <p className='episode-status'>
                        {anime.season !== null ?
                            <>
                                <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                            </>
                            :
                            <>
                                <span className='white-bold'>TBD</span><br/>
                            </>
                        }
                        This anime is set to release sometime in <span className='white-bold'>{year}</span>.
                    </p>
                );
            }
        }
        

        return(
            <p className='episode-status'>
                {anime.season !== null ?
                    <>
                        <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                    </>
                    :
                    <>
                        <span className='white-bold'>TBD</span><br/>
                    </>
                }
                Release info is unknown.
            </p>
        );
    }

    // if anime is finished airing
    else if(air_status === "finished_airing") {
        return(
            <div className='plan-to-watch-anime-info-div'>
                <p className='episode-status'>
                {anime.season !== null ?
                    <>
                        <span className='white-bold'>{anime.season[0].charAt(0).toUpperCase() + anime.season[0].slice(1)}&nbsp;{anime.season[1]}</span><br/>
                    </>
                :
                    null
                }
                    This anime has finished airing.
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