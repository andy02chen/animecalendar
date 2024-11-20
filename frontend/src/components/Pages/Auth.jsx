import { useState, useEffect, useRef } from 'react';
import axios from "axios"
import './Auth.css'
import logo from '../imgs/logo.png';
import demo1 from '../imgs/demo/demo-1.png';
import demo2 from '../imgs/demo/demo-2.png';
import demo3 from '../imgs/demo/demo-3.png';
import demo4 from '../imgs/demo/demo-4.png';
import demo5 from '../imgs/demo/demo-5.png';
import demo6 from '../imgs/demo/demo-6.png';
import demo7 from '../imgs/demo/demo-7.png';

import stats_demo1 from '../imgs/demo/demo-stats-1.png';
import stats_demo2 from '../imgs/demo/demo-stats-2.png';
import stats_demo3 from '../imgs/demo/demo-stats-3.png';
import stats_demo4 from '../imgs/demo/demo-stats-4.png';

function authRedirect() {
    window.location.href = `/auth`;
}

function homepageRedirect() {
    window.location.href = `/home`;
}

function guestRedirect() {
    window.location.href = '/guest';
}

function linkedInRedirect() {
    window.open('https://www.linkedin.com/in/andy-chen-bab130253/', '_blank');
}

function instaRedirect() {
    window.open('https://www.instagram.com/andy.c02/', '_blank');
}

function discordRedirect() {
    navigator.clipboard.writeText('zneak300');
    
    const emailDiv = document.getElementById('copied-discord-popup');
    emailDiv.classList.add('show');
    emailDiv.style.display = "block";
    setTimeout(() => {
        emailDiv.classList.remove('show');
        setTimeout(() => emailDiv.style.display = "none", 500);
    }, 2000);
}

function expandInstructionDiv(value, selectedDiv) {
    const div = document.getElementById(`how-to-use-btn-${value}`);
    const body = document.getElementById(`how-to-use-btn-${value}-text`);

    if(selectedDiv.current !== null) {
        document.getElementById(`how-to-use-btn-${selectedDiv.current}`).classList.remove('display-instructions');
        document.getElementById(`how-to-use-btn-${selectedDiv.current}-text`).style.display = 'none';
    }

    if(value === selectedDiv.current) {
        div.classList.remove('display-instructions');
        body.style.display = 'none';
        selectedDiv.current = null;
    } else {
        div.classList.add('display-instructions');
        body.style.display = 'block';
        selectedDiv.current = value;
    }
}

function Auth()  {
    const [imageIndex, setImageIndex] = useState(0);
    const [statsImageIndex, setStatsImageIndex] = useState(0);
    const [isLoggedIn, setLoggedIn] = useState(false);

    const selectedDiv = useRef(null);

    const imgArr = [
        demo1,
        demo2,
        demo3,
        demo4,
        demo5,
        demo6,
        demo7,
    ];

    const demoArr = [
        stats_demo2,
        stats_demo3,
        stats_demo4
    ]

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledImages = shuffleArray(imgArr);
    const shuffledStatsImages = shuffleArray(demoArr);

    // Calls API to check if user is logged in
    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
            })
            .catch(error => {
                if(error.response.status === 429) {
                    localStorage.setItem("errorType", "rate_limit_error");
                }
                setLoggedIn(false);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
            setStatsImageIndex((prevIndex) => (prevIndex + 1) % shuffledStatsImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return(
        <>
            {isLoggedIn ?
                <>
                    {homepageRedirect()}
                </>
                :
            <>
                <div id='copied-discord-popup'>
                    <p>Username copied to clipboard</p>
                </div>
                <div id='login-page-header' className={localStorage.getItem('darkMode') === 'true' ? "login-page-header dark-mode-add" : "login-page-header"}>
                    <div>
                        <img className='logo' src={logo} alt='logo'></img>
                        <button className='login-page-header-login-btn' onClick={() => {
                            document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure; path=/';
                            authRedirect();
                        }}>
                            <svg width="133" height="46" viewBox="0 0 133 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 30.6705V0.5H110.443L132 15.3295V45.5H22.557L1 30.6705Z" fill="#1891FF" stroke="black"/>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="20" fontFamily="Furore">
                                    Login
                                </text>
                            </svg>
                        </button>
                    </div>
                </div>
                <section className="login-page-main">
                    <div className='login-page-main-left'>
                        <h1 className='login-page-main-left-title glitch'>
                            <span aria-hidden="true">Track Your Anime</span>
                                Track Your Anime
                                <span aria-hidden="true">Track Your Anime</span>
                        </h1>
                        <svg className='login-page-main-left-frame' width="379" height="68" viewBox="0 0 379 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M378 55V53H170L171.061 55H378Z" fill="#79BFFF" stroke="#79BFFF"/>
                            <path d="M48.2385 65L48 63H104.684L105 65H48.2385Z" fill="#E2C893"/>
                            <mask id="mask0_215_671" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="11" y="19" width="221" height="4">
                            <path d="M12.9163 22L12 20H229.785L231 22H12.9163Z" fill="#D0D8DD" stroke="#D0D8DD"/>
                            </mask>
                            <g mask="url(#mask0_215_671)">
                            <rect width="239" height="22" transform="translate(5 9)" fill="#D0D8DD"/>
                            </g>
                            <mask id="mask1_215_671" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="42" height="26">
                            <rect width="42" height="26" fill="#D6B165"/>
                            </mask>
                            <g mask="url(#mask1_215_671)">
                            <path d="M10 16V10H16V16H10Z" fill="#D6B165"/>
                            <path d="M18 16V10H24V16H18Z" fill="#D6B165"/>
                            <path d="M32 10H26V16H32V10Z" fill="#D6B165"/>
                            </g>
                            <path d="M163 67.5V59L170 63.5L163 67.5Z" fill="#EBD8B3"/>
                            <text className='login-page-frame-text' x="50%" y="55%" textAnchor="middle" alignmentBaseline="middle">
                                Stay up-to-date with anime releases
                            </text>
                        </svg>
                        <div className='login-page-main-left-demo'>
                            <img className='demo-image' src={shuffledImages[imageIndex]} alt={`Demo Image Unavailable`} />
                        </div>
                    </div>
                    <div className='login-page-main-right'>
                        <div className='login-page-main-right-frame'>
                        <svg className='login-frame' width="469" height="272" viewBox="0 0 469 272" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.3373 0H0L11.6616 14.8451L24.3373 0Z" fill="#DEE4E7"/>
                            <path d="M11.6616 34.9577L0 21.5493V101.521L11.6616 116.366L0 132.169V238.479L24.3373 258.113H70.9838L77.0681 246.62H292.048L303.202 258.113H368.102L378.749 272L388.383 258.113H450.24L469 238.479V77.5775L457.338 69.4366L469 58.9014L457.338 51.2394L469 42.6197V0H259.091L248.443 10.5352H85.6876L77.0681 0H43.0973L11.6616 34.9577Z" fill="#DEE4E7"/>
                            <path d="M287 258.113H81.5L77.0681 267.5H296.5L287 258.113Z" fill="#DEE4E7"/>
                            <path d="M430.714 12L438 6H428.286L424.643 9L421 12H430.714Z" fill="#79BFFF"/>
                            <path d="M457.714 12L465 6H455.286L451.643 9L448 12H457.714Z" fill="#79BFFF"/>
                            <path d="M444.714 12L452 6H442.286L438.643 9L435 12H444.714Z" fill="#79BFFF"/>
                            <path d="M313 248.5L306.25 254.129L306.25 242.871L313 248.5Z" fill="#EBA0C8"/>
                            <rect x="5" y="40" width="10" height="10" fill="#CDA145"/>
                            <path d="M7 156.53L10 152V227H7V156.53Z" fill="#AEBCC5"/>
                            <rect x="372" y="14" width="88" height="3" fill="#7A848A"/>
                            <path d="M291.784 10L290 7H354.216L356 10H291.784Z" fill="#D6B165"/>
                        </svg>
                            <div className='login-div-overlay'>
                                <p className='login-div-better'>For a better experience:</p>
                                <button onClick={() => {
                                    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure; path=/';
                                    authRedirect();
                                }} className='login-div-mal-button' id='login-div-mal-button'>Login with MAL</button>
                                <div className='choice-div-line'></div>
                                <button className='login-div-guest-button' id="login-div-guest-button" onClick={() => guestRedirect()}>Continue as Guest</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={localStorage.getItem('darkMode') === 'true' ? "login-page-how-to-use dark-mode-add": "login-page-how-to-use"} id='login-page-how-to-use'>
                    <div className='how-to-use-div'>
                        <svg className='how-to-use-title' width="483" height="71" viewBox="0 0 483 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_140_260)">
                            <path d="M83.2998 50.5H76.2998V15.5H83.2998V29.55H100.75V15.5H107.7V50.5H100.75V36.55H83.2998V50.5ZM119.677 43.5H137.127V22.5H119.677V43.5ZM140.627 50.5H116.127L112.677 47.05V19.05L116.127 15.5H140.627L144.077 19.05V47.05L140.627 50.5ZM174.804 50.5L169.504 44.25L164.304 50.5H157.304L148.554 40.05V15.5H155.554V36.55L160.854 43.5L166.004 36.55V15.5H173.004V36.55L178.304 43.5L183.504 36.55V15.5H190.454V40.05L181.804 50.5H174.804ZM232.722 50.5H225.722V22.5H213.472V15.5H244.872V22.5H232.722V50.5ZM255.37 43.5H272.82V22.5H255.37V43.5ZM276.32 50.5H251.82L248.37 47.05V19.05L251.82 15.5H276.32L279.77 19.05V47.05L276.32 50.5ZM304.767 15.5H311.767V43.5H329.217V15.5H336.167V47.05L332.717 50.5H308.217L304.767 47.05V15.5ZM369.094 50.5H344.594L341.144 47.05V40.05H348.144V43.5H365.594V36.55H344.594L341.144 34.05V19.05L344.594 15.5H369.094L372.544 19.05V26H365.594V22.5H348.144V29.5H369.094L372.544 33V47.05L369.094 50.5ZM407.221 50.5H377.521V15.5H407.221V22.5H384.521V29.55H405.471V36.55H384.521V43.5H407.221V50.5Z" fill="#3FA4FF"/>
                            </g>
                            <path d="M427.187 65.5L418.527 50.5L435.848 50.5L427.187 65.5Z" fill="#E2C893"/>
                            <path d="M415.188 65L410.188 58H175.688L182.688 65H415.188Z" fill="#DEE4E7"/>
                            <rect x="115.188" y="67.5" width="60" height="3" fill="#79BFFF"/>
                            <rect x="62.1875" y="59.5" width="60" height="3" fill="#E2C893"/>
                            <rect x="62.1875" y="48.5" width="7" height="7" fill="#F5D0E4"/>
                            <defs>
                            <filter id="filter0_d_140_260" x="72.2998" y="15.5" width="338.921" height="43" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="4"/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_140_260"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_140_260" result="shape"/>
                            </filter>
                            </defs>
                        </svg>
                        <div className='how-to-use-div-buttons'>
                            <div id='how-to-use-btn-0' onClick={() => expandInstructionDiv(0, selectedDiv)}>
                                <h1>Guest Mode or MAL Acc</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-0-text'>
                                    Guest mode lets you explore <a className="login-page-link" href='https://myanimelist.net/profile/ZNEAK300' target='_blank'>Andy's</a> anime list as a demo with limited features. <br/>
                                    Log in with MyAnimeList to access your <span className='how-to-use-highlight'>own lists, track progress, delay episodes, and more.</span>
                                </p>
                            </div>
                            <div id='how-to-use-btn-1' onClick={() => expandInstructionDiv(1, selectedDiv)}>
                                <h1>Getting Anime Data</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-1-text'>
                                    This site pulls public anime data from your <span className='how-to-use-highlight'>'Currently Watching'</span> and <span className='how-to-use-highlight'>'Plan to Watch'</span> lists on 
                                    MyAnimeList, with a limit of 1,000 entries. 
                                    If any anime is missing, please report the issue.
                                </p>
                            </div>
                            <div id='how-to-use-btn-2' onClick={() => expandInstructionDiv(2, selectedDiv)}>
                                <h1>Next Episodes and Markers</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-2-text'>
                                The next episode date is estimated based on <span className='how-to-use-highlight'>your progress</span> and shown next to each anime. 
                                Calendar markers indicate episode dates for <span className='how-to-use-highlight'>currently airing</span> shows, with <span className='how-to-use-highlight'>all markers </span> displayed if the season's total episode count is known.
                                </p>
                            </div>
                            <div id='how-to-use-btn-4' onClick={() => expandInstructionDiv(4, selectedDiv)}>
                                <h1>Upcoming Anime Releases</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-4-text'>
                                You can view upcoming anime in the<span className='how-to-use-highlight'> 'Plan to Watch' </span>section. 
                                Selecting <span className='how-to-use-highlight'> 'Show Not Yet Aired Only' </span> will display information related to each anime's release.
                                </p>
                            </div>
                            <div id='how-to-use-btn-5' onClick={() => expandInstructionDiv(5, selectedDiv)}>
                                <h1>Update Progress</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-5-text'>
                                You can update your <span className='how-to-use-highlight'> MAL anime progress </span> here. 
                                Click 'Watched' and <span className='how-to-use-highlight'> confirm </span> to update.
                                The UI will refresh only after the update is <span className='how-to-use-highlight'> confirmed on MAL</span>. 
                                If the progress fails to update, an error will be displayed. Please <span className='how-to-use-highlight'> double-check </span> on MAL if you have<span className='how-to-use-highlight'> concerns </span> and report any issues.
                                </p>
                            </div>
                            <div id='how-to-use-btn-7' onClick={() => expandInstructionDiv(7, selectedDiv)}>
                                <h1>Can't find available episode</h1>
                                <p style={{display: "none"}} id='how-to-use-btn-7-text'>
                                The site uses the <span className='how-to-use-highlight'> airing times in Japan </span> to estimate release dates. 
                                If the estimated date is <span className='how-to-use-highlight'> incorrect</span>, 
                                your episode may be <span className='how-to-use-highlight'> delayed </span> or <span className='how-to-use-highlight'> not yet available </span> on your streaming service. 
                                If neither is the case, please report the issue.
                                </p>
                            </div>
                        </div>
                        <div className='anime-stats-demo'>
                            <div className='anime-stats-body'>
                                <h1 className={localStorage.getItem('darkMode') === 'true' ? "stats-title stats-title-dark": "stats-title"}>
                                    View Anime Stats
                                </h1>
                                <div className='stats-demos'>
                                    <div className='stats-demo-inst'>
                                        <img className='stats-demo-image' src={stats_demo1} alt={`Demo Image Unavailable`} />
                                        <h1 className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-login stats-demo-login-dark": "stats-demo-login"}>
                                            Login to get your stats
                                        </h1>
                                        <div className='stat-demo-examples-text'>
                                            <p className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-text stats-demo-text-dark": "stats-demo-text"}>
                                                Discover your anime-watching habits such as:
                                            </p>
                                            <p className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-text stats-demo-text-dark": "stats-demo-text"}>- Your Highest Rated Anime</p>
                                            <p className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-text stats-demo-text-dark": "stats-demo-text"}>- Most Watched Studios </p>
                                            <p className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-text stats-demo-text-dark": "stats-demo-text"}>- Highest Rated Studios </p>
                                            <p className={localStorage.getItem('darkMode') === 'true' ? "stats-demo-text stats-demo-text-dark": "stats-demo-text"}>- Top Genres and more...</p>
                                        </div>
                                    </div>
                                    <div className='stats-demo-cycle-image'>
                                        <img className='stats-demo-image' src={shuffledStatsImages[statsImageIndex]} alt={`Demo Image Unavailable`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="login-page-contact">
                    <div className='login-page-contact-title'>
                        <h1>Contact</h1>
                    </div>
                    <div className='login-page-contact-icons-div'>
                        <svg onClick={() => discordRedirect()} className='login-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"/></svg>
                        <svg onClick={() => instaRedirect()} className='login-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                        <svg onClick={() => linkedInRedirect()} className='login-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
                    </div>
                    <div className='login-page-created'>
                        <p >Created by Andy Chen</p>
                    </div>
                </section>
            </>
            }
        </>
    );
}

export default Auth;