import './DisplayAnimeProgress.css';
import { useContext, useState } from 'react';
import { AnimeContext } from './ProgressContainer';
import AnimeCard from './AnimeCard';

// Changes the Displayed anime list
function changeDisplayedList(list, setListSelected, selected) {
    if(list !== selected) {
        document.getElementById(`change-list-button-${list}`).classList.add('active-list');
        document.getElementById(`${selected}-anime-filters`).classList.add('hide');
        setTimeout(() => {
            document.getElementById(`change-list-button-${selected}`).classList.remove('active-list');
            setListSelected(list);
        }, 500);
        
    }
}


function DisplayAnimeProgress() {
    const {animeArray, planToWatchArray} = useContext(AnimeContext);

    // Which List
    const [listSelected, setListSelected] = useState('cw');

    // Which Filter
    const [cwFilter, setCWFilter] = useState(null);
    const [ptwFilter, setPTWFilter] = useState(null);

    const handleCWFilter = (event) => {
        const value = event.target.value;

        if(cwFilter === value) {
            setCWFilter(null);
        } else {
            setCWFilter(value);
        }
    };

    const handlePTWFilter = (event) => {
        const value = event.target.value;

        if(ptwFilter === value) {
            setPTWFilter(null);
        } else {
            setPTWFilter(value);
        }
    };

    return(
        <>
            <div className='progress-display-anime'>
                {listSelected === 'cw' && 
                (<div className='list-of-anime-cards'>
                    {animeArray.map((anime, index)=> {
                        return(
                            <>
                                <AnimeCard anime={anime} key={anime.id} type={'cw'}/>
                                {index === animeArray.length - 1 ? <div></div> : <div className='anime-card-divider'></div> }
                            </>
                        );
                    })}
                </div>)
                }
                {listSelected === 'ptw' && 
                (<div className='list-of-anime-cards'>
                    {planToWatchArray.map((anime)=> {
                        return <AnimeCard anime={anime} key={anime.id} type={'ptw'}/>
                    })}
                </div>)
                }
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
                {listSelected === 'cw' &&
                    (
                    <div className='display-anime-filters' id='cw-anime-filters'>
                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="curr_airing" checked={cwFilter === "curr_airing"} onChange={handleCWFilter}/>
                            <span className="check-button"></span>
                            Currently Airing Only
                        </label>

                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="fin_airing" checked={cwFilter === "fin_airing"} onChange={handleCWFilter}/>
                            <span className="check-button"></span>
                            Finished Airing Only
                        </label>
                    </div>
                    )
                }
                {listSelected === 'ptw' && (
                    <div className='display-anime-filters' id='ptw-anime-filters'>
                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="curr_not_yet_airing" checked={ptwFilter === "curr_not_yet_airing"} onChange={handlePTWFilter}/>
                            <span className="check-button"></span>
                            Not Yet or Currently Airing Only
                        </label>

                        <label className="anime-filters-check">
                            <input type="checkbox" name="option" value="fin_only" checked={ptwFilter === "fin_only"} onChange={handlePTWFilter}/>
                            <span className="check-button"></span>
                            Finished Only
                        </label>
                    </div>
                )}
                <div className='display-which-list'>
                    <button id='change-list-button-cw' className='change-list-button active-list' onClick={() => changeDisplayedList('cw', setListSelected, listSelected)}>
                        Currently Airing
                    </button>
                    <button id='change-list-button-ptw' className='change-list-button' onClick={() => changeDisplayedList('ptw', setListSelected, listSelected)}>
                        Plan To Watch
                    </button>
                </div>
            </div>
        </>
    );
}

export default DisplayAnimeProgress;