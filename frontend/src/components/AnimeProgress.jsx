import './AnimeProgress.css'

function AnimeProgress() {
    return(
        <>
            <div className='heading'>
                <h1 className='title'>Weekly Anime Progress</h1>
            </div>

            <div className='progress-div'>
                <ul className='anime-list'>
                    <li className='weekly-anime'>Anime</li>
                    <li className='weekly-anime'>Anime</li>
                    <li className='weekly-anime'>Anime</li>
                </ul>
            </div>
        </>
    );
}

export default AnimeProgress;