import { useState, useEffect } from 'react';
import './Auth.css'
import logo from '../imgs/logo.png';
import demo1 from '../imgs/demo/demo-1.png';
import demo2 from '../imgs/demo/demo-2.png';
import demo3 from '../imgs/demo/demo-3.png';
import demo4 from '../imgs/demo/demo-4.png';
import demo5 from '../imgs/demo/demo-5.png';
import demo6 from '../imgs/demo/demo-6.png';
import demo7 from '../imgs/demo/demo-7.png';

function Auth()  {
    const [imageIndex, setImageIndex] = useState(0);

    const imgArr = [
        demo1,
        demo2,
        demo3,
        demo4,
        demo5,
        demo6,
        demo7,
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledImages = shuffleArray(imgArr);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return(
        <>
            <div className='login-page-header'>
                <img className='logo' src={logo} alt='logo'></img>
                <button className='login-page-header-login-btn' onClick={() => {
                    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure; path=/';
                    authRedirect();
                }}>
                    <svg width="133" height="46" viewBox="0 0 133 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 30.6705V0.5H110.443L132 15.3295V45.5H22.557L1 30.6705Z" fill="#1891FF" stroke="black"/>
                        <text x="50%" y="50%" textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="20" fontFamily="Furore">
                            Login
                        </text>
                    </svg>
                </button>
            </div>
            <section className="login-page-main">
                <div className='login-page-main-left'>
                    <h1 className='login-page-main-left-title'>Track Your Anime</h1>
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
                    <p>Demo screenshots</p>
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
                            }} className='login-div-mal-button'>Login with MAL</button>
                            <div className='choice-div-line'></div>
                            <button className='login-div-guest-button' onClick={() => guestRedirect()}>Continue as Guest</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="login-page-how-to-use">
                <div className='how-to-use-left'>
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
                    <div className='how-to-use-left-buttons'>
                        <button>Guest mode or MAL Acc</button>
                        <button>Getting Anime Data</button>
                        <button>Next Episode Release Date</button>
                        <button>Upcoming Anime Releases</button>
                        <button>Update Progress</button>
                        <button>Rate Your Anime</button>
                        <button>Can't find available episode</button>
                    </div>
                </div>
                <div className='how-to-use-right'>
                    <svg className='how-to-use-right-top-frame' width="469" height="47" viewBox="0 0 469 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="9.84998" width="5.33212" height="2.13333" fill="#EBD8B3"/>
                        <rect x="11.1643" y="8.78333" width="293.267" height="4.26667" fill="#EBD8B3"/>
                        <path d="M16.6381 6.65L8.56909 0.25H19.3277L23.3622 3.45L27.3967 6.65H16.6381Z" fill="#79BFFF"/>
                        <path d="M32.776 6.65L24.707 0.25H35.4657L39.5001 3.45L43.5346 6.65H32.776Z" fill="#79BFFF"/>
                        <path d="M48.9139 6.65L40.845 0.25H51.6036L55.6381 3.45L59.6726 6.65H48.9139Z" fill="#79BFFF"/>
                        <path d="M128.295 46.75L118.845 42.4833H459.05L468.5 46.75H128.295Z" fill="#AEBCC5"/>
                        <path d="M324.604 38.2167L316.451 28.6167L332.756 28.6167L324.604 38.2167Z" fill="#0F589C"/>
                    </svg>
                    <div id='how-to-use-instructions'>

                    </div>
                    <svg className='how-to-use-right-bot-frame' width="469" height="51" viewBox="0 0 469 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="80" y="16.75" width="9.51499" height="9.44579" fill="#E2C893"/>
                        <path d="M85.4004 33.5425L80 29.3444H274.414L279.815 33.5425H85.4004Z" fill="#AEBCC5"/>
                        <path d="M287.795 29.4152L291.729 36.4245L283.647 36.3019L287.795 29.4152Z" fill="#1166B3"/>
                        <rect x="232.24" y="16.75" width="135.324" height="3.1486" fill="#A0D2FF"/>
                        <rect x="308.36" y="21.9977" width="159.64" height="4.19813" fill="#E2C893"/>
                        <path d="M449.069 17.15L441 10.75H451.759L455.793 13.95L459.828 17.15H449.069Z" fill="#79BFFF"/>
                        <path d="M435.069 17.15L427 10.75H437.759L441.793 13.95L445.828 17.15H435.069Z" fill="#79BFFF"/>
                    </svg>
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
        
    );
}

export default Auth;