import './MenuPages.css';
import './Tutorial.css';

// Close Tutoria Page
function closeTutorial() {
    const div = document.getElementById('tutorial-page');
    if(div.style.display === 'block') {
        div.style.display = 'none'
    }
}

function Tutorial() {
    return(
        <div id="tutorial-page" style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Tutorial</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeTutorial()}>&#10006;</h1>
                    </div>
                    <div className='menupage-content-text'>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorial;