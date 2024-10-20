import './MenuPages.css';
import './Tutorial.css';

// Close Tutoria Page
function closeTutorial() {
    const div = document.getElementById('tutorial-page');
    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

// Expand Tutorial
function expandTutorial(value) {
    const text = document.getElementById(`tutorial-${value}-text`);
    const div = document.getElementById(`tutorial-${value}-title`);
    const symbol = document.getElementById(`tutorial-symbol-${value}`);
    if(text.style.display === 'none') {
        text.style.display = 'block';
        div.classList.add('expand-tutorial-text');
        symbol.classList.add('expand-symbol');
    } else {
        div.classList.remove('expand-tutorial-text');
        symbol.classList.remove('expand-symbol');
        setTimeout(() => {
            text.style.display = 'none';
            
        }, 500);
    }
}

function Tutorial() {
    return(
        <div id="tutorial-page" className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Tutorial</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeTutorial()}>&#10006;</h1>
                    </div>
                    <div className='menupage-content-text tutorial-page-content'>
                        <div id='tutorial-0-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(0)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Guest or MAL</h1>
                                <svg id='tutorial-symbol-0' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-0-text' style={{display: "none"}}>
                                Guest mode lets you explore <a className="login-page-link" href='https://myanimelist.net/profile/ZNEAK300' target='_blank'>Andy's</a> anime list as a demo with limited features. <br/>
                                Log in with MyAnimeList to access your <span className='how-to-use-highlight'>own lists, track progress, delay episodes, and more.</span>
                            </p>
                        </div>
                        <div id='tutorial-1-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(1)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Getting Anime Data</h1>
                                <svg id='tutorial-symbol-1' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-1-text' style={{display: "none"}}>
                                This site pulls public anime data from your <span className='how-to-use-highlight'>'Currently Watching'</span> and <span className='how-to-use-highlight'>'Plan to Watch'</span> lists on 
                                MyAnimeList, with a limit of 1,000 entries. 
                                If any anime is missing, please report the issue.
                            </p>
                        </div>
                        <div id='tutorial-2-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(2)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Next Episodes and Markers</h1>
                                <svg id='tutorial-symbol-2' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-2-text' style={{display: "none"}}>
                                The next episode date is estimated based on <span className='how-to-use-highlight'>your progress</span> and shown next to each anime. 
                                Calendar markers indicate episode dates for <span className='how-to-use-highlight'>currently airing</span> shows, with <span className='how-to-use-highlight'>all markers </span> displayed if the season's total episode count is known.
                            </p>
                        </div>
                        <div id='tutorial-3-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(3)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Delaying Episodes</h1>
                                <svg id='tutorial-symbol-3' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            
                            <p id='tutorial-3-text' style={{display: "none"}}>
                                Beside each <span className='how-to-use-highlight'>currently airing anime</span>, you'll find a 'Delay' button. 
                                Clicking this button lets you specify the number of weeks until the next episode is released, helping you keep track of upcoming episodes. 
                                Please make sure to enter the correct delay, as any misinputs could impact the 
                                <span className='how-to-use-highlight'> estimated release dates for future episodes.</span>
                                <br/>
                                <br/>
                                All data is stored in local storage, so please do not clear it from your browser. 
                                <span className='how-to-use-highlight'> If you wish to remove unnecessary data, there will be an option available in the settings.</span>
                            </p>
                        </div>
                        <div id='tutorial-4-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(4)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Upcoming Anime Releases</h1>
                                <svg id='tutorial-symbol-4' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            
                            <p id='tutorial-4-text' style={{display: "none"}}>
                            You can view upcoming anime in the<span className='how-to-use-highlight'> 'Plan to Watch' </span>section. 
                            Selecting <span className='how-to-use-highlight'> 'Show Not Yet Aired Only' </span> will display information related to each anime's release.
                            </p>
                        </div>
                        <div id='tutorial-5-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(5)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Update Progress</h1>
                                <svg id='tutorial-symbol-5' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            
                            <p id='tutorial-5-text' style={{display: "none"}}>
                                You can update your <span className='how-to-use-highlight'> MAL anime progress </span> here. 
                                Click 'Watched' and <span className='how-to-use-highlight'> confirm </span> to update.
                                The UI will refresh only after the update is <span className='how-to-use-highlight'> confirmed on MAL</span>. 
                                If the progress fails to update, an error will be displayed. Please <span className='how-to-use-highlight'> double-check </span> on MAL if you have<span className='how-to-use-highlight'> concerns </span> and report any issues.
                            </p>
                        </div>
                        <div id='tutorial-6-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(6)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Rate Your Anime</h1>
                                <svg id='tutorial-symbol-6' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-6-text' style={{display: "none"}}>
                            Upon <span className='how-to-use-highlight'> completing </span> an anime, you'll have the option to rate it. 
                            If you choose not to rate, you can simply skip this step.
                            </p>
                        </div>
                        <div id='tutorial-7-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(7)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Episode Available?</h1>
                                <svg id='tutorial-symbol-7' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-7-text' style={{display: "none"}}>
                                The site uses the <span className='how-to-use-highlight'> airing times in Japan </span> to estimate release dates. 
                                If the estimated date is <span className='how-to-use-highlight'> incorrect</span>, 
                                your episode may be <span className='how-to-use-highlight'> delayed </span> or <span className='how-to-use-highlight'> not yet available </span> on your streaming service. 
                                If neither is the case, please report the issue.
                            </p>
                        </div>
                        <div id='tutorial-8-title' className='tutorial-page-expand-button' onClick={() => expandTutorial(8)}>
                            <div className='tutorial-header'>
                                <h1 className='tutorial-title'>Early Episode Release</h1>
                                <svg id='tutorial-symbol-8' className='tutorial-expand-symbol' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </div>
                            <p id='tutorial-8-text' style={{display: "none"}}>
                            If an anime has <span className='how-to-use-highlight'>multiple episodes or if episodes are released earlier </span> than expected, 
                            a prompt will appear, allowing you to adjust <span className='how-to-use-highlight'>all estimated release dates</span> by moving them up by a specified number of weeks. 
                            <br/><br/>
                            Please note that all data is stored in local storage, so <span className='how-to-use-highlight'>do not clear it from your browser</span>. You can remove unnecessary data through the settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorial;