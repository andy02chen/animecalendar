import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

function App() {

  function redirectURI() {
    const URI = `GET https://myanimelist.net/v1/oauth2/authorize?
    response_type=code
    &client_id=YOUR_CLIENT_ID
    &state=YOUR_STATE
    &redirect_uri=YOUR_REDIRECT_URI
    &code_challenge=YOUR_PKCE_CODE_CHALLENGE
    &code_challenge_method=plain 
    HTTP/1.1
    Host: YOUR_HOST_URL`
  }

  return (
    <>
      <button onClick={redirectURI} className='login-button'>Login with MAL</button>
    </>
  )
}

export default App
