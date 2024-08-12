import { useState, useEffect } from "react";
import './Popup.css'

function Popup() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const consentGiven = localStorage.getItem('consentGiven');
        if (!consentGiven) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
    };

    const handleAcceptForever = () => {
        localStorage.setItem('consentGiven', 'true');
        setIsVisible(false);
    };

    return(
        isVisible && (
            <div className="popup-localStorage">
                <h2 className="popup-localStorage-title">This site uses Cookies and LocalStorage</h2>
                <p className="popup-localStorage-text">
                    Preferences and some anime tracking data are saved in cookies and localStorage.<br/>
                    Clearing your browser data or using incognito mode may result in the loss of this information.<br/>
                    Data will not be saved across devices.
                </p>
                <div className="popup-button-div">
                    <button onClick={handleAccept}>Accept</button>
                    <button onClick={handleAcceptForever}>Accept and Don't show again</button>
                </div>
            </div>
        )
    );
}

export default Popup;