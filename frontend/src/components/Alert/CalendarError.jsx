import './Error.css';
import { useState, useEffect, useRef } from 'react';

function closeError() {
    localStorage.removeItem('errorType');

    const errorDiv = document.getElementById('error-message-alert');
    errorDiv.classList.remove('show');
    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 500);
}

function CalenderError({displayError}) {
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        const errorType = localStorage.getItem('errorType');

        if(errorType === 'error_anime_lists') {
            setErrorMessage(
                "There was an error getting your anime lists"
            );
        }


    }, [displayError]);

    return(
        displayError && 
            (<div className='error-alert-div-shape show' id='error-message-alert' style={{display: 'flex'}}>
                <div className='error-alert-div-contents'>
                    <div className='error-alert-header-div'>
                        <h1>Error</h1>
                        <h1 className='error-close-button' onClick={() => closeError()}>&#10006;</h1>
                    </div>
                    <div className='error-divider'><div></div></div>
                    <div className='error-alert-message'>
                        {errorMessage}
                    </div>
                </div>
            </div>)
    );
}

export default CalenderError;