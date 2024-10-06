import './Error.css';
import { useState, useEffect } from 'react';

function closeError() {
    localStorage.removeItem('errorType');

    const errorDiv = document.getElementById('error-message-alert');
    errorDiv.classList.remove('show');
    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 500);
}

function Error() {
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const errorType = localStorage.getItem('errorType');

        if(errorType === 'error_get_plan_to_watch') {
            setErrorMessage(
                "There was an error getting Plan To Watch list from MyAnimeList"
            )
        }


    }, []);

    return(
        errorMessage && 
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

export default Error;