import React, {useState, useEffect, createContext} from 'react'
import axios from "axios"
import CalendarPage from './CalendarPage';

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
            localStorage.setItem("errorType", "refresh_token_error");
            localStorage.removeItem("username");
            localStorage.removeItem("pfp");
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

export const MyContext = createContext("");

function HomePage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [loginChecked, setLoginChecked] = useState(false);

    // Calls API to check if user is logged in
    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                localStorage.setItem("username",response.data.username);
                localStorage.setItem("pfp", response.data.picture);
                setLoginChecked(true);

                if(response.data.loggedIn) {
                    refreshInterval = setInterval(refreshAccessToken,refreshTime);
                }
            })
            .catch(error => {
                axios.delete('/api/logout')
                .then(response => {
                    localStorage.setItem('errorType', "check_login_error");
                    localStorage.removeItem("username");
                    localStorage.removeItem("pfp");
                    window.location.href = response.data.redirect_url;
                })
            });
    }, []);

    // Redirects to login page if not logged in
    return(
        <>
            {loginChecked ?
                <>
                    {isLoggedIn?
                        <CalendarPage/>
                        :
                        <>
                            {loginRedirect()}
                        </>
                    }
                </>
                :
                null
            }
        </>
    );
}

export default HomePage;