import { useState, useEffect } from "react";
import './Popup.css'

function Popup() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const consentGiven = localStorage.getItem('consentGiven');
        if (!consentGiven) {
            setIsVisible(true);
            document.getElementById('main-div').style.overflow = 'hidden';
        } else {
            setIsVisible(false);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        document.getElementById('main-div').style.overflow = 'auto';
    };

    const handleAcceptForever = () => {
        localStorage.setItem('consentGiven', 'true');
        setIsVisible(false);
        document.getElementById('main-div').style.overflow = 'auto';
    };

    return(
        isVisible && (
            <div className="gray-screen">
                <div className="popup-localStorage">
                    <h2 className="popup-localStorage-title">This site uses Cookies and LocalStorage</h2>
                    <p className="popup-localStorage-text">
                        Preferences and some anime tracking data are saved in cookies and localStorage.<br/>
                        Clearing your browser data or using incognito mode may result in the loss of this information.<br/>
                        Your anime delayed data will not be saved across devices. (May change in a future update)
                    </p>
                    <div className="popup-button-div">
                        <button onClick={() => handleAccept()}>Accept</button>
                        <button onClick={() => handleAcceptForever()}>Accept and Hide</button>
                    </div>
                </div>
            </div>
            
        )
    );
}

export default Popup;