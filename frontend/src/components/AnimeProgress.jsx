import './AnimeProgress.css'

function AnimeProgress() {
    return(
        <>
            <div className='heading'>
                <h1 className='title'>Weekly Anime Progress</h1>
            </div>

            <div className='progress-div'>
                <uL className='anime-list'>
                    <li className='weekly-anime'>Anime</li>
                    <li className='weekly-anime'>Anime</li>
                    <li className='weekly-anime'>Anime</li>
                </uL>
            </div>
        </>
    );
}

export default AnimeProgress;