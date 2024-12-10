import './ProgressContainer.css'
import defaultpfp from '../imgs/defaultpfp.png';
import axios from 'axios';
import { useRef, useEffect, useState} from 'react';
import DisplayAnimeProgress from './DisplayAnimeProgress';

// Display Progress Container and hide expand div
function expandProgressContainer() {
    const div = document.getElementById("progress-container");
    const expandDiv = document.getElementById("expand-progress-container");
    const collapseDiv = document.getElementById("collapse-progress-container");

    div.style.display = "block";
    expandDiv.style.display = "none";
    collapseDiv.style.display = "block";
}

// Hide progress Container and hide collapse div
function collapseProgressContainer() {
    const div = document.getElementById("progress-container");
    const expandDiv = document.getElementById("expand-progress-container");
    const collapseDiv = document.getElementById("collapse-progress-container");

    div.style.display = "none";
    expandDiv.style.display = "block";
    collapseDiv.style.display = "none";
}

// Expands settings
function expandSettings() {
    const divHidden = document.getElementById('progress-hidden-settings');
    const button = document.getElementById('progress-settings-user');

    if(divHidden.style.display === 'none') {
        divHidden.style.display = "block";
    } else {
        divHidden.style.display = "none";
    }
}

// Log out Function
function logOut() {
    axios.delete('/api/logout')
        .then(response => {
            localStorage.removeItem('username');
            localStorage.removeItem('pfp');
            window.location.href = response.data.redirect_url;
        })
        .catch(error => {
            localStorage.setItem('errorType', 'error_logout');
            window.location.href = '/';
        });
}

// Expand Feedback page
function expandFeedback() {
    const div = document.getElementById("feedback-page");
    document.getElementById('progress-hidden-settings').style.display = "none";
    if (div.style.display === 'none') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

// Expand Tutorial page
function expandTutorial() {
    const div = document.getElementById("tutorial-page");
    document.getElementById('progress-hidden-settings').style.display = "none";
    if (div.style.display === 'none') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

// Expand Notice page
function expandNotice() {
    const div = document.getElementById("notice-page");
    document.getElementById('progress-hidden-settings').style.display = "none";
    if (div.style.display === 'none') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

// Expand stats page
function expandStats() {
    const div = document.getElementById("anime-stats-page");
    document.getElementById('progress-hidden-settings').style.display = "none";
    if (div.style.display === 'none') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

// Expand Settings page
function expandSettingsOptions() {
    const div = document.getElementById("settings-page");
    document.getElementById('progress-hidden-settings').style.display = "none";
    if (div.style.display === 'none') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

function ProgressContainer({refresh, version}) {
    const div1 = useRef(null);
    const progressDiv = useRef(null);
    const animeStatsLastUpdateVersion = '2.3';

    // For if user clicks gray area, collapse progress
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (div1.current && !div1.current.contains(event.target) && progressDiv.current && progressDiv.current.contains(event.target)) {
                collapseProgressContainer()
            }
        };
        
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
    
        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return(
        <>
            <div id="progress-container" ref={progressDiv}>
                <div className='progress-div1' ref={div1}>
                    <svg className='progress-div1-svg' viewBox="0 0 336 996" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"> 
                    <path d="M18.241 3L3 25.8462V993H16.3359L30.7386 957.573L305.597 957.574L319.568 993H333.221V3H18.241Z" fill="#1A344E" stroke="#1891FF" strokeWidth="5"/>
                    <path d="M32.3527 959.602L18.1895 992.423H317.7L304.327 959.602H32.3527Z" fill="#CDA145" stroke="#1891FF"/>
                    <path d="M35.1045 985.498V972.039C37.6729 964.861 40.4553 969.048 41.5255 972.039V985.498C38.2232 996.265 35.8689 989.984 35.1045 985.498Z" fill="#E2C893"/>
                    <path d="M43.3594 985.498V972.039C45.9278 964.861 48.7102 969.048 49.7803 972.039V985.498C46.4781 996.265 44.1238 989.984 43.3594 985.498Z" fill="#E2C893"/>
                    <path d="M51.6162 985.498V972.039C54.1846 964.861 56.967 969.048 58.0372 972.039V985.498C54.735 996.265 52.3806 989.984 51.6162 985.498Z" fill="#E2C893"/>
                    <path d="M68.1279 985.498V972.039C70.6963 964.861 73.4787 969.048 74.5489 972.039V985.498C71.2467 996.265 68.8923 989.984 68.1279 985.498Z" fill="#E2C893"/>
                    <path d="M76.3818 985.498V972.039C78.9502 964.861 81.7326 969.048 82.8028 972.039V985.498C79.5006 996.265 77.1462 989.984 76.3818 985.498Z" fill="#E2C893"/>
                    <path d="M95.6455 985.498V972.039C98.2139 964.861 100.996 969.048 102.066 972.039V985.498C98.7643 996.265 96.4099 989.984 95.6455 985.498Z" fill="#E2C893"/>
                    <path d="M110.321 985.498V972.039C112.89 964.861 115.672 969.048 116.742 972.039V985.498C113.44 996.265 111.086 989.984 110.321 985.498Z" fill="#E2C893"/>
                    <path d="M132.336 985.498V972.039C134.904 964.861 137.687 969.048 138.757 972.039V985.498C135.455 996.265 133.1 989.984 132.336 985.498Z" fill="#E2C893"/>
                    <path d="M121.33 985.498V972.039C123.898 964.861 126.681 969.048 127.751 972.039V985.498C124.449 996.265 122.094 989.984 121.33 985.498Z" fill="#E2C893"/>
                    <path d="M158.021 985.498V972.039C160.589 964.861 163.371 969.048 164.441 972.039V985.498C161.139 996.265 158.785 989.984 158.021 985.498Z" fill="#E2C893"/>
                    <path d="M166.275 985.498V972.039C168.844 964.861 171.626 969.048 172.696 972.039V985.498C169.394 996.265 167.04 989.984 166.275 985.498Z" fill="#E2C893"/>
                    <path d="M174.531 985.498V972.039C177.1 964.861 179.882 969.048 180.952 972.039V985.498C177.65 996.265 175.296 989.984 174.531 985.498Z" fill="#E2C893"/>
                    <path d="M182.787 985.498V972.039C185.355 964.861 188.138 969.048 189.208 972.039V985.498C185.906 996.265 183.552 989.984 182.787 985.498Z" fill="#E2C893"/>
                    <path d="M208.471 985.498V972.039C211.039 964.861 213.822 969.048 214.892 972.039V985.498C211.589 996.265 209.235 989.984 208.471 985.498Z" fill="#E2C893"/>
                    <path d="M216.726 985.498V972.039C219.294 964.861 222.076 969.048 223.147 972.039V985.498C219.844 996.265 217.49 989.984 216.726 985.498Z" fill="#E2C893"/>
                    <path d="M231.402 985.498V972.039C233.971 964.861 236.753 969.048 237.823 972.039V985.498C234.521 996.265 232.167 989.984 231.402 985.498Z" fill="#E2C893"/>
                    <path d="M242.41 985.498V972.039C244.979 964.861 247.761 969.048 248.831 972.039V985.498C245.529 996.265 243.175 989.984 242.41 985.498Z" fill="#E2C893"/>
                    <path d="M253.419 985.498V972.039C255.987 964.861 258.77 969.048 259.84 972.039V985.498C256.538 996.265 254.183 989.984 253.419 985.498Z" fill="#E2C893"/>
                    <path d="M283.689 985.498V972.039C286.258 964.861 289.04 969.048 290.11 972.039V985.498C286.808 996.265 284.454 989.984 283.689 985.498Z" fill="#E2C893"/>
                    <path d="M294.696 985.498V972.039C297.265 964.861 300.047 969.048 301.117 972.039V985.498C297.815 996.265 295.461 989.984 294.696 985.498Z" fill="#E2C893"/>
                    <line x1="38.1914" y1="970.069" x2="38.1914" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="46.4463" y1="970.069" x2="46.4463" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="54.7021" y1="970.069" x2="54.7021" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="71.2139" y1="970.069" x2="71.2139" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="79.4697" y1="970.069" x2="79.4697" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="98.7305" y1="970.069" x2="98.7305" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="113.408" y1="970.069" x2="113.408" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="124.416" y1="970.069" x2="124.416" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="135.423" y1="970.069" x2="135.423" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="161.107" y1="970.069" x2="161.107" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="169.363" y1="970.069" x2="169.363" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="177.619" y1="970.069" x2="177.619" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="185.874" y1="970.069" x2="185.874" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="211.557" y1="970.069" x2="211.557" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="219.812" y1="970.069" x2="219.812" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="234.487" y1="970.069" x2="234.487" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="245.497" y1="970.069" x2="245.497" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="256.505" y1="970.069" x2="256.505" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="286.773" y1="970.069" x2="286.773" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    <line x1="297.783" y1="970.069" x2="297.783" y2="960.1" stroke="#E2C893" strokeWidth="3"/>
                    </svg>

                    <div className='progress-content-div'>
                        <div className='progress-header-div'>
                            {localStorage.getItem('username') === "Guest" ?
                                <h1>DEMO LIST</h1>
                                :
                                <h1>YOUR LIST</h1>
                            }
                            <div className='progress-settings-div' id='progress-settings-div'>
                                <button id='progress-settings-user' className='progress-settings-buttons' onClick={() => expandSettings()}>
                                    <img alt="pfp" src={localStorage.getItem('pfp') === 'null' ? defaultpfp : localStorage.getItem('pfp') }></img>
                                    {version !== localStorage.getItem('seenAnnouncement') || localStorage.getItem('seenAnnouncement') !== animeStatsLastUpdateVersion ?
                                        <div className='notice-noti'/>
                                        :
                                        null
                                    }
                                    <p className='progress-settings-title'>&nbsp;{localStorage.getItem('username')}</p>
                                    <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                                </button>
                                <div id='progress-hidden-settings' style={{display: 'none'}} >
                                    <button className='progress-settings-buttons' onClick={() => expandStats()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"/></svg>
                                        {localStorage.getItem('seenAnnouncement') !== animeStatsLastUpdateVersion ?
                                            <div className='notice-noti'/>
                                            :
                                            null
                                        }
                                        <p className='progress-settings-title'>&nbsp; View Stats</p>
                                    </button>
                                    <button className='progress-settings-buttons' onClick={() => expandNotice()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75l-8.7 0-32 0-96 0c-35.3 0-64 28.7-64 64l0 96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-128 8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-147.6c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4L480 32zm-64 76.7L416 240l0 131.3C357.2 317.8 280.5 288 200.7 288l-8.7 0 0-96 8.7 0c79.8 0 156.5-29.8 215.3-83.3z"/></svg>
                                        {version !== localStorage.getItem('seenAnnouncement') ?
                                            <div className='notice-noti'/>
                                            :
                                            null
                                        }
                                        <p className='progress-settings-title'>&nbsp;Notice</p>
                                    </button>
                                    <button className='progress-settings-buttons' onClick={() => expandTutorial()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/></svg>
                                        <p className='progress-settings-title'>&nbsp;Tutorial</p>
                                    </button>
                                    <button className='progress-settings-buttons' onClick={() => expandFeedback()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z"/></svg>
                                        <p className='progress-settings-title'>&nbsp;Feedback</p>
                                    </button>
                                    <button className='progress-settings-buttons' onClick={() => expandSettingsOptions()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                                        <p className='progress-settings-title'>&nbsp;Settings</p>
                                    </button>
                                    <button className='progress-settings-buttons' onClick={() => logOut()}>
                                        <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                                        <p className='progress-settings-title'>&nbsp;Log Out</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='progress-note'>
                            <p>Note: Release times are based on MAL data and may differ from those on your streaming platform.</p>
                        </div>
                        <svg className='progress-top-divider' viewBox="0 0 469 47" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='none'>
                        <rect x="0.5" y="9.84998" width="5.33212" height="2.13333" fill="#EBD8B3"/>
                        <rect x="11.1643" y="8.78333" width="293.267" height="4.26667" fill="#EBD8B3"/>
                        <path d="M16.6381 6.65L8.56909 0.25H19.3277L23.3622 3.45L27.3967 6.65H16.6381Z" fill="#79BFFF"/>
                        <path d="M32.776 6.65L24.707 0.25H35.4657L39.5001 3.45L43.5346 6.65H32.776Z" fill="#79BFFF"/>
                        <path d="M48.9139 6.65L40.845 0.25H51.6036L55.6381 3.45L59.6726 6.65H48.9139Z" fill="#79BFFF"/>
                        <path d="M128.295 46.75L118.845 42.4833H459.05L468.5 46.75H128.295Z" fill="#AEBCC5"/>
                        <path d="M324.604 38.2167L316.451 28.6167L332.756 28.6167L324.604 38.2167Z" fill="#0F589C"/>
                        </svg>
                        <DisplayAnimeProgress/>
                    </div>
                    <div id='collapse-progress-container' >
                        <div className="trapezium" onClick={() => collapseProgressContainer()}>
                            <span className="arrow">
                                &lt;
                            </span>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div id='expand-progress-container'>
                <div className="trapezium" onClick={() => expandProgressContainer()}>
                    <span className="arrow">
                        &gt;
                    </span>
                </div>
            </div>
        </>
    );
}

export default ProgressContainer;