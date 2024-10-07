import { useState } from 'react';
import './Alert.css'

function Alert() {
    function closePopup() {
        const popup = document.getElementById("error-popup");
        popup.classList.remove("show-error");
        popup.classList.add("hide-error");
        localStorage.removeItem('errorMsgDiv');
    }

    const showErrorMsg = localStorage.getItem('errorMsgDiv');
    if(showErrorMsg === '1') {
        return(
            <div className="custom-popup show-error" id="error-popup">
                <div className="popup-header">
                    <h2 className="popup-title">Error</h2>
                    <span className="close-button-popup" onClick={() => closePopup()}>&times;</span>
                </div>
                <div className="popup-content">
                    <p id="popup-error-message" className='popup-text'>There was error with fetching data from MAL servers. Please try logging in again later.</p>
                </div>
            </div>
        );
    } else if (showErrorMsg === '2') {
        return(
            <div className="custom-popup show-error" id="error-popup">
                <div className="popup-header">
                    <h2 className="popup-title">Error</h2>
                    <span className="close-button-popup" onClick={() => closePopup()}>&times;</span>
                </div>
                <div className="popup-content">
                    <p id="popup-error-message" className='popup-text'>OAuth state did not match the one stored on the server. This is likely not an issue on the server side and you may be the target of a CSRF attack.</p>
                </div>
            </div>
        );
    } else if (showErrorMsg === '3') {
        return(
            <div className="custom-popup show-error" id="error-popup">
                <div className="popup-header">
                    <h2 className="popup-title">Error</h2>
                    <span className="close-button-popup" onClick={() => closePopup()}>&times;</span>
                </div>
                <div className="popup-content">
                    <p id="popup-error-message" className='popup-text'>An error occurred. You may have exceeded the rate limit. Please wait a moment before trying again. If the issue persists, please report this issue.</p>
                </div>
            </div>
        );
    } else if(showErrorMsg) {
        return(
            <div className="custom-popup show-error" id="error-popup">
                <div className="popup-header">
                    <h2 className="popup-title">Error</h2>
                    <span className="close-button-popup" onClick={() => closePopup()}>&times;</span>
                </div>
                <div className="popup-content">
                    <p id="popup-error-message" className='popup-text'>There was error verifying your login details. Please try logging in again. If this error persists, please report bug.</p>
                </div>
            </div>
        );
    }

    return(
        <div className="custom-popup hide-error" id="error-popup">
            <div className="popup-header">
                <h2 className="popup-title">Error</h2>
                <span className="close-button-popup" onClick={() => closePopup()}>&times;</span>
            </div>
            <div className="popup-content">
                <p id="popup-error-message" className='popup-text'></p>
            </div>
        </div>
    );
}

export default Alert;