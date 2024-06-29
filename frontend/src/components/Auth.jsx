import { useState, useEffect } from 'react'
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

    // Calls API to check if user is logged in
    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                setLoaded(true);
                console.log(response);
            })
            .catch(error => {
                setLoaded(true);
            });
    }, []);

    // Redirects to login page if not logged in
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
        </>
    );
}

export default Auth
