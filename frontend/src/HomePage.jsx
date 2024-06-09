import React, {useState, useEffect} from 'react'
import axios from "axios"

function loginRedirect() {
    window.location.href = `/a`
}

// TODO error refreshing
// TODO redirect to auth if error with refreshing tokens
function refreshAccessToken() {
    axios.post("/api/refresh-token")
    .then(response => {
        console.log(response);
        resetTimer()
    })
    .catch(error => {
        console.error(error);
    })
}

function resetTimer() {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshAccessToken,refreshTime);
    console.log("refreshed");
}

const tokenExpiry = 60 * 60 * 1000 // Every Hour
const refreshBuffer = 5 * 60 * 1000; // 5 mins before expiry
const refreshTime = tokenExpiry - refreshBuffer;
let refreshInterval;

function HomePage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [hasLoaded, setLoaded] = useState(false);    

    // Calls API to check if user is logged in
    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                setLoaded(true);
                console.log(response.data.loggedIn)

                if(response.data.loggedIn) {
                    refreshInterval = setInterval(refreshAccessToken,refreshTime);
                }
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
                            <h1>Home Page</h1>
                            <p>User is logged in.</p>
                            <button onClick={() => refreshAccessToken()}>Refresh Token</button>
                        </>
                        :
                        <>
                            {loginRedirect()}
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

export default HomePage;