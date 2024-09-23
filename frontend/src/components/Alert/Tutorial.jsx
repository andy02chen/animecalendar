import './Tutorial.css'

const closeTutorial = () => {
    document.getElementById('tutorial-div').style.display = "none";
    document.getElementById('main-div').style.overflow = 'auto';
};

function Tutorial() {
    return(
        <div className="gray-screen" id="tutorial-div" style={{display: "none"}}>
            <div className="feedback-div">
                <h2 className="feedback-title">Tutorial</h2>
                    <h3 className='announcement-mini-title'>
                        Guest Mode or MAL Acc
                    </h3>
                    <p className="announcement-text">
                        Guest mode lets you explore <a className="login-page-link" href='https://myanimelist.net/profile/ZNEAK300' target='_blank'>Andy's</a> anime list as a demo with limited features. <br/>
                        Log in with MyAnimeList to access your <span className='how-to-use-highlight'>own lists, track progress, delay episodes, and more.</span>
                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Getting Anime Data
                    </h3>
                    <p className="announcement-text">
                        This site pulls public anime data from your <span className='how-to-use-highlight'>'Currently Watching'</span> and <span className='how-to-use-highlight'>'Plan to Watch'</span> lists on 
                        MyAnimeList, with a limit of 1,000 entries. 
                        If any anime is missing, please report the issue.                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Next Episodes and Markers
                    </h3>
                    <p className="announcement-text">
                        The next episode date is estimated based on <span className='how-to-use-highlight'>your progress</span> and shown next to each anime. 
                        Calendar markers indicate episode dates for <span className='how-to-use-highlight'>currently airing</span> shows, with <span className='how-to-use-highlight'>all markers </span> displayed if the season's total episode count is known.

                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Delaying Episodes
                    </h3>
                    <p className="announcement-text">
                        Next to each anime is a <span className='how-to-use-highlight'>delay button</span>, functional only for <span className='how-to-use-highlight'>currently airing </span> shows. 
                        This button delays the estimated date by a <span className='how-to-use-highlight'>week</span>, and changes are reflected on the calendar. 
                        Note that this data is stored <span className='how-to-use-highlight'> locally on your machine</span>, so progress may not match across devices.
                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Upcoming Anime Releases
                    </h3>
                    <p className="announcement-text">
                        You can view upcoming anime in the<span className='how-to-use-highlight'> 'Plan to Watch' </span>section. 
                        Selecting <span className='how-to-use-highlight'> 'Show Not Yet Aired Only' </span> will display information related to each anime's release.
                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Update Progress
                    </h3>
                    <p className="announcement-text">
                        You can update your <span className='how-to-use-highlight'> MAL anime progress </span> here. 
                        Click 'Watched' and <span className='how-to-use-highlight'> confirm </span> to update.
                        The UI will refresh only after the update is <span className='how-to-use-highlight'> confirmed on MAL</span>. 
                        If the progress fails to update, an error will be displayed. Please <span className='how-to-use-highlight'> double-check </span> on MAL if you have<span className='how-to-use-highlight'> concerns </span> and report any issues.
                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Rate Your Anime
                    </h3>
                    <p className="announcement-text">
                        Upon <span className='how-to-use-highlight'> completing </span> an anime, you'll have the option to rate it. 
                        If you choose not to rate, you can simply skip this step.
                    </p>
                    <br/>

                    <h3 className='announcement-mini-title'>
                        Can't find available episode
                    </h3>
                    <p className="announcement-text">
                        The site uses the <span className='how-to-use-highlight'> airing times in Japan </span> to estimate release dates. 
                        If the estimated date is <span className='how-to-use-highlight'> incorrect</span>, 
                        your episode may be <span className='how-to-use-highlight'> delayed </span> or <span className='how-to-use-highlight'> not yet available </span> on your streaming service. 
                        If neither is the case, please report the issue.
                    </p>
                    <br/>
                    <div>
                        <button className='close-feedback' onClick={() => closeTutorial()}>Close</button>
                    </div>
            </div>
        </div>
    );
}

export default Tutorial;