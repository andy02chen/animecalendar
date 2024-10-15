import './Error.css';
import { useState, useEffect, useRef } from 'react';

function CalendarError({displayError}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [hasError, setHasError] = useState(false);

    const closeError = () => {
        localStorage.removeItem('errorType');

        const errorDiv = document.getElementById('error-message-alert');
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.style.display = "none";
        }, 500);
        setHasError(false); 
    }
    
    useEffect(() => {
        const errorType = localStorage.getItem('errorType');

        if(errorType === 'update_anime_error') {
            setErrorMessage(
                "There was an error updating progress. Please try again later."
            );
            setHasError(true); 
        }


    }, [displayError]);

    return(
        hasError && 
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

export default CalendarError;