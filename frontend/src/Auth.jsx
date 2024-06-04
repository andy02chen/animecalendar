import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

function authRedirect() {
    window.location.href = `/auth`;
}

function homepageRedirect() {
    window.location.href = `/home`
}

function Auth() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [hasLoaded, setLoaded] = useState(false);

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

    return(
        <>
            {hasLoaded ?
                <>
                    {isLoggedIn ?
                        <>
                            {homepageRedirect()}
                        </>
                        :
                        <>
                            <button onClick={authRedirect} className='login-button'>Login with MAL</button>
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
        </>
    );

    return (
        <>
            <button onClick={authRedirect} className='login-button'>Login with MAL</button>
            <br></br>
            <button>Continue as Guest</button>
        </>
    )
}

export default Auth
