import { useEffect, useState } from 'react';
import './Announcement.css';

const closeAnnouncement = () => {
    document.getElementById('announcement-div').style.display = "none";
    document.getElementById('main-div').style.overflow = 'auto';
};

function Announcement() {
    // TODO edit when update
    const version = "1.1";
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if user has already seen the announcement
        // Hide the red indicator if they have
        // User can still read announcment if they choose to

        const hasSeen = localStorage.getItem('seenAnnouncement');
        if (hasSeen === version) {
            document.getElementById('announcement-button').classList.add('hide-indicator');
            document.getElementById('settings-div-show-btn').classList.add('hide-indicator');
        }
    }, []);

    return(
        (isVisible &&
            <div className="gray-screen" id="announcement-div" style={{display: "none"}}>
                <div className="feedback-div">
                    <h2 className="feedback-title">Version 1.1!</h2>
                    <p className="announcement-text">
                        Hey there! Thanks for checking out my website. This is my first time launching a site, so please bear with me if you encounter any issues.
                        <br/><br/>
                        This site is designed to complement the MyAnimeList app. As a fellow MAL user, I found that while the anime tracker is useful, it can be a bit lacking. 
                        Keeping track of episode release dates has become a challenge, especially when watching multiple seasonal anime. That's why I created this site—to make tracking and managing your anime experience a bit easier.
                        <br/><br/>
                    </p>
                    <h3 className='announcement-mini-title'>
                        A few things to note:
                    </h3>
                    <p className="announcement-text">
                        - This site updates your anime progress and uses MAL data to calculate release dates and countdowns.<br/>
                        - You'll still need to manage your lists on MAL.<br/>
                        - I'm planning to keep improving the site.
                    </p>
                    <br/>
                    <p className='announcement-minier-title'>
                        Changes:
                    </p>
                    <p className="announcement-text">
                        - Login Page redesigned<br/>
                        - Tutorial in the menu
                    </p>
                    <br/>
                    <p className='announcement-minier-title'>
                        Planned Updates (In no particular order):
                    </p>
                    <p className="announcement-text">
                        - Calendar page redesign
                        - Option to change anime marker colours<br/>
                        - Light Mode / Dark Mode<br/>
                        - Animated month transitions and scroll controls<br/>
                        - Sync preferences and anime delayed data across devices (currently stored locally)<br/>
                        - User statistic on delayed episodes (If enough users)<br/>
                        - Expandable calendar dates for more information<br/>
                        - Option to revert delayed episodes<br/><br/>

                        I appreciate your support and feedback as I continue to refine and enhance the site. Enjoy!
                    </p>
                    <div>
                        <button className='close-feedback' onClick={() => closeAnnouncement()}>Close</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default Announcement;