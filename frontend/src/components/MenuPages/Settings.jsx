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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;