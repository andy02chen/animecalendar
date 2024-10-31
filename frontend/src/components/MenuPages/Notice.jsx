import './MenuPages.css';
import './Notice.css';

// Close Notice Page
function closeNotice(setRefresh) {
    const div = document.getElementById('notice-page');

    if(localStorage.getItem('seenAnnouncement') !== '2.0') {
        localStorage.setItem('seenAnnouncement', '2.0');
        setRefresh(r => !r);
    }

    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

function Notice({setRefresh}) {
    return(
        <div id="notice-page" className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Notice</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeNotice(setRefresh)}>&#10006;</h1>
                    </div>
                    <div className='menupage-content-text notice-page-content'>
                        <h1 className='big-title'>Version 2.0!</h1>
                        <h2 className='smaller-title'>Changes:</h2>
                        <ul className='list'>
                            <li>
                                <p>UI Redesigned</p>
                            </li>
                            <li>
                                <p>Buttons for updating anime have been reworked</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;- Watched Button - Able to update multiple episodes</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;- Delayed Button - Able to delay multiple weeks</p>
                            </li>
                            <li>
                                <p>New Button/Prompt - Early Episodes</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;- If episode is released and the estimation is wrong (a week behind), a prompt will appear to
                                    offset all episode releases by a week.
                                </p>
                            </li>
                            <li>
                                <p>Settings</p>
                                <p>Dark Mode/Light mode button</p>
                                <p>Clear LocalStorage buttons</p>
                            </li>
                            <li>
                                <p>Ability to change marker colour</p>
                            </li>
                            <li>
                                <p>Optimised storage of information on browser (~30mb RAM usage on my PC)</p>
                            </li>
                            <li>
                                <p>More accurate status for anime with no broadcast time</p>
                            </li>
                        </ul>
                        <br/>

                        <h2 className='smaller-title'>Planned Updates:</h2>
                        <ul className='list'>
                            <li>
                                <p>Dashboard with data about your anime viewing preferences. Prob will be similar to Spotify Wrapped.</p>
                            </li>
                            <li>
                                <p>Ability to click on dates for more information</p>
                            </li>
                            <li>
                                <p>Notications when estimated release</p>
                            </li>
                            <li>
                                <p>Control calendar by scrolling</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notice;