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
                        <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" fill="white" font-size="20" font-family="Furore">
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
                        <text className='login-page-frame-text' x="50%" y="55%" text-anchor="middle" alignment-baseline="middle">
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

            </section>
            <section className="login-page-contact">

            </section>
        </>
        
    );
}

export default Auth;