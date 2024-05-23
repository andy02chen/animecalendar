import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

function Auth() {
    // Generate a random state for Auth
    function generateRandomState(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Retrieves the state stored in cookie
    function getStateFromCookie() {
        return document.cookie.match('(^|;)\\s*' + "oauth_state" + '\\s*=\\s*([^;]+)')?.pop() || ''
    }

    // Generate Code Verifier with length of 128
    function generateCodeVerifier() {
        const length = 128;
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = "";

        for(let i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }

        return result;
    }

    // Get the client Id from backend
    async function getClientId() {
        try{
            const response = await axios.get("http://127.0.0.1:5000/api/client-id");
            return response.data.clientId;
        } catch(error) {
            console.error('Error fetching client ID:', error);
        }
    }

    // Redirect for Authentication
    async function redirectURI() {
        // Generate Code Verifier and Challenge and store in session storage
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = codeVerifier;

        // Retrieve Client ID from backend
        const clientId = await getClientId();

        // Stores it as a cookie
        if (clientId) {
            const state = generateRandomState();

            //TODO https
            document.cookie = `oauth_state=${state}; Path=/`;

            const redirect_uri = `http://localhost:5173/oauth`
            const URI = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirect_uri}&code_challenge=${codeChallenge}&code_challenge_method=plain`

            window.location.href = URI;
        }
    }

    async function getAuth() {
        try{
            const response = await axios.get("http://127.0.0.1:5000/oauth");
            console.log(response);
        } catch(error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <button onClick={redirectURI} className='login-button'>Login with MAL</button>
            <br></br>
            <button>Continue as Guest</button>
        </>
    )
}

export default Auth
