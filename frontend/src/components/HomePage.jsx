import React, {useState, useEffect} from 'react'
import axios from "axios"
import MainComponent from './MainComponent'

function loginRedirect() {
    window.location.href = `/a`
}

function refreshAccessToken() {
    axios.put("/api/refresh-token")
    .then(response => {
        resetTimer()
    })
    .catch(error => {
        axios.delete('/api/delete-user')
        .then(response => {
            document.cookie = 'session=; Max-Age=-99999999;';
            alert(error.response.data);
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

                if(response.data.loggedIn) {
                    refreshInterval = setInterval(refreshAccessToken,refreshTime);
                }
            })
            .catch(error => {
                setLoaded(true);
            });

        // Get users weekly anime
        axios.get('/api/get-weekly-anime')
        .then(response => {
            console.log(response)
        })
        .catch (error => {
            console.error(error)
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
                            <button onClick={() => refreshAccessToken()}>Refresh</button>
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