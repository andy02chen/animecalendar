import { useState, useEffect } from 'react'
import axios from "axios"
import './Auth.css'
import demo1 from '../imgs/demo/demo-1.png';
import demo2 from '../imgs/demo/demo-2.png';
import demo3 from '../imgs/demo/demo-3.png';
import demo4 from '../imgs/demo/demo-4.png';
import demo5 from '../imgs/demo/demo-5.png';
import demo6 from '../imgs/demo/demo-6.png';
import demo7 from '../imgs/demo/demo-7.png';

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
    
    const emailDiv = document.getElementById('copied-email-div');
    emailDiv.classList.add('show');
    emailDiv.style.display = "block";
    setTimeout(() => {
        emailDiv.classList.remove('show');
        setTimeout(() => emailDiv.style.display = "none", 500);
    }, 2000);
}

function Auth() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [hasLoaded, setLoaded] = useState(false);
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


    // Calls API to check if user is logged in
    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                setLoaded(true);
            })
            .catch(error => {
                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Redirects to home page if logged in
    return(
        <div className='login-page'>
            {hasLoaded ?
                <>
                    {isLoggedIn ?
                        <>
                            {homepageRedirect()}
                        </>
                        :
                        <>
                            <div id='copied-email-div' style={{display: "none"}}>
                                <p>Copied to clipboard</p>
                            </div>
                            <div className='main-page-image'>
                                <div className='credit'>Background Image from <a className='credit-link' href='https://neural.love/' target='_blank'>neural.love</a></div>
                                <div className='demo-div'>
                                    <div className='screenshots-div'>
                                        <img className='demo-image' src={shuffledImages[imageIndex]} alt={`Demo Image ${imageIndex}`} />
                                    </div>
                                    <div className='div-line'></div>
                                    <div className='login-choice-div'>
                                        <div className='mal-choice-div'>
                                            <p>For a better experience:</p>
                                            <button onClick={() => {
                                                document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure; path=/';
                                                authRedirect();
                                            }} className='login-button'>Login with MAL</button>
                                        </div>
                                        <div className='choice-div-line'></div>
                                        <div className='guest-choice-div'>
                                            <button onClick={() => guestRedirect()}>Continue as Guest</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='contact-div'>
                                <div>
                                    <svg onClick={() => discordRedirect()} className='main-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"/></svg>
                                    <svg onClick={() => instaRedirect()} className='main-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                                    <svg onClick={() => linkedInRedirect()} className='main-page-contact-icons' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
                                </div>
                                <p className='created'>Created by Andy Chen</p>
                            </div>
                        </>
                    }
                </>
                :
                <>
                    <div className='loading-div'>
                        <svg className='loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
                        <p className='message-text'>Loading...</p>
                    </div>
                </>
            }
            
        </div>
    );
}

export default Auth
