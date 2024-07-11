import React, {useState, useEffect} from 'react'
import axios from "axios"
import MainComponent from '../MainComponent'
function loginRedirect() {
    window.location.href = `/a`
}

function refreshAccessToken() {
    axios.put("/api/refresh-token")
    .then(response => {
        resetTimer();
    })
    .catch(error => {
        axios.delete('/api/logout')
        .then(response => {
            localStorage.setItem('errorMsgDiv', true);
            localStorage.removeItem('username');
            localStorage.removeItem('pfp');
            document.cookie = 'session=; Max-Age=-99999999;';
            window.location.href = response.data.redirect_url;
        })
    })
}

function resetTimer() {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshAccessToken,refreshTime);
}

const tokenExpiry = 60 * 60 * 1000 // Every Hour
const refreshBuffer = 5 * 60 * 1000; // 5 mins before expiry
const refreshTime = tokenExpiry - refreshBuffer;
// const refreshTime = 5000;
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
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('pfp', response.data.picture);

                if(response.data.loggedIn) {
                    refreshInterval = setInterval(refreshAccessToken,refreshTime);
                }
            })
            .catch(error => {
                localStorage.setItem('errorMsgDiv', '3');
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
                            <MainComponent/>
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