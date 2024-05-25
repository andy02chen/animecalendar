import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

function Auth() {

    function authRedirect() {
        window.location.href = `/auth`
    }

    return (
        <>
            <button onClick={authRedirect} className='login-button'>Login with MAL</button>
            <br></br>
            <button>Continue as Guest</button>
        </>
    )
}

export default Auth
