import { useState, useEffect } from 'react';
import './Auth.css'
import logo from '../imgs/logo.png';
import frame from '../shapes/frame1.svg'
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
                <button className='login-page-header-login-btn'>
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
                    {/* <img className='login-page-main-left-frame1' src={frame}/>
                    <h3>Stay up-to-date with anime releases</h3> */}
                    <div className='login-page-main-left-demo'>
                        <img className='demo-image' src={shuffledImages[imageIndex]} alt={`Demo Image Unavailable`} />
                    </div>
                    <p>Demo screenshots; dates are not accurate</p>
                </div>
                <div className='login-page-main-right'>

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