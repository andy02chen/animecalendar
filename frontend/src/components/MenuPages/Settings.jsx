import './Settings.css';
import './MenuPages.css';

function setDarkMode(event) {
    if (event.target.checked) {
        localStorage.setItem('darkMode', 'true');
    } else {
        localStorage.setItem('darkMode', 'false');
    }
}

function Settings() {
    const closeSettings = () => {
        const div = document.getElementById('settings-page');
        if(div.style.display === 'flex') {
            div.style.display = 'none'
        }
    }

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
                                <input type="checkbox" onChange={setDarkMode}/>
                                {/* <input type="checkbox" name="option" value="curr_airing" checked={cwFilter === "curr_airing"} onChange={handleCWFilter}/> */}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;