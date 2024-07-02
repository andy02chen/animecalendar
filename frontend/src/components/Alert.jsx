import { useState } from 'react';
import './Alert.css'

function Alert() {
    function closePopup() {
        const popup = document.getElementById("error-popup");
        popup.classList.add("hide-error");
        popup.classList.remove("show-error");
        localStorage.removeItem('errorMsgDiv');
    }

    const showErrorMsg = localStorage.getItem('errorMsgDiv');
    if(showErrorMsg) {
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
        <div className="custom-popup" id="error-popup">
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

export default Alert;