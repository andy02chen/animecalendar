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
            <div className="localstorage-popup">
                <div className="localstorage-popup-shape">
                    <svg className="popup-svg-shape" preserveAspectRatio="none" viewBox="0 0 374 217" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 216V1H373V193L344 216H1Z" fill="#1A344E" stroke="#3FA4FF" strokeWidth="2"/>
                    </svg>
                    <div className="popup-contain-text">
                        <h1 className="popup-content-title">This site uses Cookies and LocalStorage</h1>
                        <p className="popup-content-text">
                            Preferences and some anime tracking data are saved in cookies and localStorage.<br/>
                            Clearing your browser data or using incognito mode may result in the loss of this information.<br/>
                            Your anime delayed data will not be saved across devices. (May change in a future update)
                        </p>
                        <div className="popup-content-buttons">
                            <button onClick={() => handleAccept()}>Accept</button>
                            <button onClick={() => handleAcceptForever()}>Accept and Hide</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default Popup;