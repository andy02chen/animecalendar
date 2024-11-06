import './AnimeStats.css';

function closeStats() {
    const div = document.getElementById('anime-stats-page');
    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

function AnimeStats() {
    return(
        <div id='anime-stats-page' className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        <h1>Your Anime Stats</h1>
                        <h1 className='menu-page-close-button' onClick={() => closeStats()}>&#10006;</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeStats;