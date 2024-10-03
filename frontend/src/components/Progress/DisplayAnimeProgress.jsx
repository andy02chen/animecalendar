import './DisplayAnimeProgress.css';
import { useContext } from 'react';
import { AnimeContext } from './ProgressContainer';

function DisplayAnimeProgress() {
    const {animeArray, planToWatchArray} = useContext(AnimeContext);

    console.log(animeArray, planToWatchArray);
    return(
        <>
            <div className='progress-display-anime'>
                Display Anime
            </div>
            <svg className='progress-bot-divider' preserveAspectRatio='none' viewBox="0 0 469 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="16.75" width="9.51499" height="9.44579" fill="#E2C893"/>
            <path d="M85.4004 33.5425L80 29.3444H274.414L279.815 33.5425H85.4004Z" fill="#AEBCC5"/>
            <path d="M287.795 29.4152L291.729 36.4245L283.647 36.3019L287.795 29.4152Z" fill="#1166B3"/>
            <rect x="232.24" y="16.75" width="135.324" height="3.1486" fill="#A0D2FF"/>
            <rect x="308.36" y="21.9977" width="159.64" height="4.19813" fill="#E2C893"/>
            <path d="M449.069 17.15L441 10.75H451.759L455.793 13.95L459.828 17.15H449.069Z" fill="#79BFFF"/>
            <path d="M435.069 17.15L427 10.75H437.759L441.793 13.95L445.828 17.15H435.069Z" fill="#79BFFF"/>
            </svg>
            <div className='progress-filters'>
                <div className='display-anime-filters'>
                    <p>Filter 1</p>
                    <p>Filter 2</p>
                </div>
                <div className='display-which-list'>
                    <button id='change-list-button-cw' className='change-list-button'>
                        Currently Airing
                    </button>
                    <button id='change-list-button-ptw' className='change-list-button'>
                        Plan To Watch
                    </button>
                </div>
            </div>
        </>
    );
}

export default DisplayAnimeProgress;