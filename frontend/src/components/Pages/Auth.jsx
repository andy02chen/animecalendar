import { useState, useEffect } from 'react'
import axios from "axios"
import './Auth.css'

function authRedirect() {
    window.location.href = `/auth`;
}

function homepageRedirect() {
    window.location.href = `/home`
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
                            <button onClick={() => {
                                document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                authRedirect();
                            }} className='login-button'>Login with MAL</button>
                            <br></br>
                            <button>Continue as Guest</button>
                        </>
                    }
                </>
                :
                <>
                    <p>Loading...</p>
                </>
            }
        </div>
    );
}

export default Auth
