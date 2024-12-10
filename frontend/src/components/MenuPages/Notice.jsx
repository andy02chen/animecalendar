import './MenuPages.css';
import './Notice.css';

// Close Notice Page
function closeNotice(setRefresh, version) {
    const div = document.getElementById('notice-page');

    if(localStorage.getItem('seenAnnouncement') !== version) {
        localStorage.setItem('seenAnnouncement', version);
        setRefresh(r => !r);
    }

    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

function Notice({setRefresh, version}) {
    return(
        <div id="notice-page" className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Notice</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeNotice(setRefresh, version)}>&#10006;</h1>
                    </div>
                    <div className='menupage-content-text notice-page-content'>
                        <h1 className='big-title'>Version {version}!</h1>
                        <h2 className='smaller-title'>Changes:</h2>
                        <ul className='list'>
                            <br/>
                            <li>
                                <p>Added More Anime stats</p>
                            </li>
                            <li>
                                <p>Stats separated into categories, for more efficient filtering</p>
                            </li>
                            <li>
                                <p>Finish date added to MAL when completing anime</p>
                            </li>
                            <li>
                                <p>Start date added to MAL when starting/updating anime</p>
                            </li>
                        </ul>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notice;