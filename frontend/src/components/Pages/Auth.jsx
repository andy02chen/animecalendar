import { useState, useEffect } from 'react'
import axios from "axios"
import './Auth.css'

function authRedirect() {
    window.location.href = `/auth`;
}

function homepageRedirect() {
    window.location.href = `/home`;
}

function guestRedirect() {
    window.location.href = '/guest';
}

function Auth() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [hasLoaded, setLoaded] = useState(false);

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
                            <div className='demo-div'>
                                <div className='screenshots-div'></div>
                                <div className='div-line'></div>
                                <div className='login-choice-div'>
                                    <div className='mal-choice-div'>
                                        <p>For a better experience:</p>
                                        <button onClick={() => {
                                            document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                            authRedirect();
                                        }} className='login-button'>Login with MAL</button>
                                    </div>
                                    <div className='choice-div-line'></div>
                                    <div className='guest-choice-div'>
                                        <button onClick={() => guestRedirect()}>Continue as Guest</button>
                                    </div>
                                </div>
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
            <div className='contact-div'>
                <h1>Contact</h1>
            </div>
        </div>
    );
}

export default Auth
