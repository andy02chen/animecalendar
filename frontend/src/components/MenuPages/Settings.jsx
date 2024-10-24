import './Settings.css';
import './MenuPages.css';
import { useState } from 'react';

function setDarkMode(event, setIsDarkMode) {
    if (event.target.checked) {
        localStorage.setItem('darkMode', 'true');
        setIsDarkMode(true);
        document.body.classList.add('dark-mode');
    } else {
        localStorage.setItem('darkMode', 'false');
        setIsDarkMode(false);
        document.body.classList.remove('dark-mode');
    }
}

function Settings() {
    const closeSettings = () => {
        const div = document.getElementById('settings-page');
        if(div.style.display === 'flex') {
            div.style.display = 'none'
        }
    }

    const displayConfirmation = () => {
        document.getElementById('clear-localstorage-confirmation').style.display = "flex";
    }

    const clearLocalStorage = () => {
        localStorage.clear();
        location.reload();
    }

    // Dark mode
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    return(
        <div id='settings-page' className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Settings</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeSettings()}>&#10006;</h1>
                    </div>
                    <div className='setting-page-body'>
                        <div className='setting-row'>
                            <h1 className='setting-title'>Dark Mode</h1>
                            <label className='settings-checkbox'>
                                <input type="checkbox" checked={isDarkMode} onChange={(event) => setDarkMode(event, setIsDarkMode)}/>
                            </label>
                        </div>
                        <div className='setting-row'>
                            <button className='settings-row-button'>
                                <h1 className='setting-title'>Clear LocalStorage (Unnecessary Data)</h1>
                            </button>

                        </div>
                        <div className='setting-row'>
                            <button className='settings-row-button' onClick={() => displayConfirmation()}>
                                <h1 className='setting-title'>Clear LocalStorage (All Data)</h1>
                            </button>
                        </div>
                        <div className='setting-row' id='clear-localstorage-confirmation' style={{display: 'none'}}>
                            <h1 className='setting-title'>
                                All you saved data will be cleared. This may affect the estimated release dates for animes.
                            </h1>
                            <button className='settings-row-button confirmation' onClick={() => clearLocalStorage()}>
                                <h1 className='setting-title'>Click to Confirm</h1>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;