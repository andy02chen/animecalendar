import { useState, useEffect, useRef } from 'react';
import './AnimeStats.css';
import axios from 'axios';
import React from 'react';

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import AnimeStatsScores from './AnimeStatsScores';
import AnimeStatsGenres from './AnimeStatsGenres';

function closeStats() {
    const div = document.getElementById('anime-stats-page');
    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

function getGuestStats(setLoading, setAPICallSuccess, setData) {
    setLoading(true);
    axios.get("/api/user-stats").
    then(response => {
        setData(response.data);
        setAPICallSuccess(true);
        setLoading(false);
    }).catch(error => {
        setData(null);
        setAPICallSuccess(false);
        setLoading(false);
    })
}

// Calls api for stats
function getUserStats(setLoading, setAPICallSuccess, setDataUser, category, setAPICallSuccesses) {
    setLoading(true);

    switch(category) {
        // Get Scoring Data
        case 0:
            axios.get("/api/user-stats").
            then(response => {
                setDataUser((d) => {
                    const newArr = [...d];
                    newArr[category] = response.data;
                    return newArr;
                })
                setAPICallSuccess(true);
                setLoading(false);
                setAPICallSuccesses((c) => {
                    const newArray = [...c];
                    newArray[category] = true;
                    return newArray;
                })
            }).catch(error => {
                setDataUser((d) => {
                    const newArr = [...d];
                    newArr[category] = null;
                    return newArr;
                })
                setAPICallSuccess(false);
                setLoading(false);
            });
            break;

        // Get Genre Data
        case 1:
            axios.get("/api/user-stats-genres").
            then(response => {
                setDataUser((d) => {
                    const newArr = [...d];
                    newArr[category] = response.data;
                    return newArr;
                })
                setAPICallSuccess(true);
                setLoading(false);
                setAPICallSuccesses((c) => {
                    const newArray = [...c];
                    newArray[category] = true;
                    return newArray;
                })
            }).catch(error => {
                setDataUser((d) => {
                    const newArr = [...d];
                    newArr[category] = null;
                    return newArr;
                })
                setAPICallSuccess(false);
                setLoading(false);
            });
            break;

        default: 
            setLoading(false);
            setAPICallSuccess(false);
    }
}

// Displays the stats
function statsDisplayFunction(whichCategory, whichDisplay, data, dataMax) {
    switch(whichCategory) {
        // Stats related to Scoring
        case 0:
            dataMax.current = 5
            return <AnimeStatsScores whichDisplay={whichDisplay} data={data}/>

        // Stats related to Genres
        case 1:
            dataMax.current = 5;
            return <AnimeStatsGenres whichDisplay={whichDisplay} data={data}/>
    }
}

function AnimeStats() {
    const [APICallSuccess, setAPICallSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);
    const [dataDisplay, setDataDisplay] = useState(0);
    const dataMax = useRef(4);

    const [dataUser, setDataUser] = useState([{},{},{},{},{}]);

    const [category, setCategory] = useState(-1);
    const [APICallSuccesses, setAPICallSuccesses] = useState([false,false,false,false,false]);

    const changeCategory = (event) => {
        // Change category
        setCategory(Number(event.target.value));

        // Get display to first slide and remove disabled on forward button if necessary
        setDataDisplay(0);
        const front = document.getElementById('forward-switch-data');

        if(front.disabled) {
            front.removeAttribute('disabled');
        }
    }

    if(localStorage.getItem('username') === "Guest") {
        dataMax.current = 5;
    }

    const backSlide = () => {
        const back = document.getElementById('back-switch-data');
        const front = document.getElementById('forward-switch-data');

        if(front.disabled) {
            front.removeAttribute('disabled');
        }

        if(dataDisplay > 1) {
            if(back.disabled) {
                back.removeAttribute('disabled');
            }
        } else if(dataDisplay === 1) {
            back.setAttribute('disabled', 'disabled');
        }
        setDataDisplay(d => d - 1);
    }

    const forwardSlide = () => {
        const front = document.getElementById('forward-switch-data');
        const back = document.getElementById('back-switch-data');

        if(back.disabled) {
            back.removeAttribute('disabled');
        }

        if(dataDisplay < dataMax.current - 2) {
            if(front.disabled) {
                front.removeAttribute('disabled');
            }
        } else if (dataDisplay === (dataMax.current - 2)) {
            front.setAttribute('disabled', 'disabled');
        }
        setDataDisplay(d => d + 1);
    }

    const changeSlide = (slide) => {
        const front = document.getElementById('forward-switch-data');
        const back = document.getElementById('back-switch-data');
        
        if(slide === 0) {
            back.setAttribute('disabled', 'disabled');

            if(front.disabled) {
                front.removeAttribute('disabled');
            }
        } else if (slide === (dataMax.current - 1)) {
            front.setAttribute('disabled', 'disabled');

            if(back.disabled) {
                back.removeAttribute('disabled');
            }

        } else {
            if(front.disabled) {
                front.removeAttribute('disabled');
            }

            if(back.disabled) {
                back.removeAttribute('disabled');
            }
        }
        setDataDisplay(slide);
    }

    // Structure for data
    const RatingPieChart = (data) => {
        return(
            <>
            <h1 className='data-h1'>
                Ratings of Completed Anime
            </h1>
            <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <PieChart className='rating-pie-chart'>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        label
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={graphGetColor()}/>
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={50}/>
                </PieChart>
            </ResponsiveContainer>
            </>
        );
    }

    const animeSourcesChart = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Anime Sources
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                    <BarChart data={data} className='source-bar-chart'>
                        <XAxis dataKey="source" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" name="Count">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={graphGetColor()} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </>
        )
    }

    const animeYears = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Completed the most anime released in these years
                </h1>
                {data.map((entry, index) => (
                    <h2 key={index} className='data-h2'>
                        {entry["start_year"]} <span className='yellow-stat'>- {entry['count']} completed</span>
                    </h2>
                ))}
            </>
        );
    }

    const top10GenresByCount = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Top 10 Genres by Count
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-10-count-bar-chart">
                    <XAxis type="number" dataKey="count"/>
                    <YAxis type="category" dataKey="genre" width={100} />
                    <Tooltip/>
                    <Bar dataKey="count" name="Count">
                        <LabelList dataKey="count" position="right" />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={graphGetColor()} />
                            ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </>
        );
    }

    const mostWatchedStudios = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Most Watched Studios
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-studios-count">
                    <XAxis type="number" dataKey="count"/>
                    <YAxis type="category" dataKey="studio_name" width={100} />
                    <Tooltip/>
                    <Bar dataKey="count" name="Count">
                        <LabelList dataKey="count" position="right" />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={graphGetColor()} />
                            ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </>
        );
    }

    const topStudiosAvg = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Top 10 Studios by Average Rating
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                    <BarChart layout="vertical" data={data} className="top-10-average-bar-chart">
                        <XAxis type="number" dataKey="average"/>
                        <YAxis type="category" dataKey="studio_name" width={100} />
                        <Tooltip formatter={(value, name, props) => {
                            const count = props.payload.count;
                            return `${value}, Count: ${count}`;
                        }}/>
                        <Bar dataKey="average" name="Average">
                            <LabelList dataKey="average" position="right" />
                            {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={graphGetColor()} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </>
        );
    }

    return(
        <div id='anime-stats-page' className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-no-shape'>
                <div className='menu-page-content'>
                    <div className='anime-stats-header'>
                        <div className='anime-stats-close'>
                            {localStorage.getItem('username') === "Guest" ?
                                <h1>Demo Anime Stats</h1>
                                :
                                <h1>Your Anime Stats</h1>
                            }
                            <h1 className='menu-page-close-button' onClick={() => closeStats()}>&#10006;</h1>
                        </div>
                        {localStorage.getItem('username') === "Guest" ? 
                            null
                            :
                            <div className='anime-stats-choose-category'>
                                <label htmlFor="anime-stats-category-dropdown" className='category-text'>Select a category: </label>
                                <select id="anime-stats-category-dropdown" style={{ fontSize: "20px", padding: "5px" }} value={category} onChange={changeCategory}>
                                    <option value={-1} disabled>
                                        Not chosen
                                    </option>
                                    <option value={0}>Scoring</option>
                                    <option value={1}>Genre</option>
                                    <option value={2}>Preferences</option>
                                    <option value={3}>Viewing Habits</option>
                                    <option value={4}>Studios</option>
                                </select>
                            </div>
                        }
                    </div>
                    <div className='anime-stats-page-body'>
                        {loading ?
                        <>
                            <div className='anime-page-loading-container'>
                                <svg className='anime-page-loading-spinner' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                                </svg>
                                <p className='anime-page-loading'>Loading...</p>
                            </div>
                        </>
                        :
                        (
                            localStorage.getItem('username') === "Guest" ?
                                (APICallSuccess === null || APICallSuccess === false?
                                    <>
                                        <h1 className='stats-warning'>
                                            Stats can be retrieved every 5 minutes to prevent overload.
                                            <br/>
                                            As you are a guest the anime stats will be taken from Andy's public data on MyAnimelist.
                                            If you would like your anime stats, please login to your MyAnimeList account.
                                            <br/>
                                            <br/>
                                            If you're seeing this message due to a refresh or loading error, come back and try again later.
                                        </h1>
                                        <button className='get-stats-button' onClick={() => getGuestStats(setLoading, setAPICallSuccess, setData)}> Get Stats </button>
                                    </>
                                    :
                                    <>
                                        <div className='display-data-div'>
                                            {(() => {
                                                switch (dataDisplay) {
                                                    case 0:
                                                        return top10GenresByCount(data['top_10_genres_count']);

                                                    case 1:
                                                        return RatingPieChart(data['popular_ratings']);

                                                    case 2:
                                                        return animeYears(data['season_anime']);

                                                    case 3:
                                                        return animeSourcesChart(data['sources']);

                                                    case 4:
                                                        return mostWatchedStudios(data['top_10_studios_count']);

                                                    default:
                                                        return <div>No data available</div>;
                                                }
                                            })()}
                                        </div>
                                        <div className='switch-data-screen'>
                                            <button id='back-switch-data' className='switch-data-buttons' onClick={() => backSlide()}>
                                                ◀
                                            </button>
                                            <div className='data-slides'>
                                                {
                                                    Array.from({ length: dataMax.current }, (_, i) => (
                                                        <div key={i} className={i === dataDisplay ? "slide active-slide" : "slide"}
                                                        onClick={() => changeSlide(i)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <button id='forward-switch-data' className='switch-data-buttons' onClick={() => forwardSlide()}>
                                                ▶
                                            </button>
                                        </div>
                                    </>
                                )
                            :
                            (APICallSuccesses[category] === false || category === -1 ?
                                <>
                                    <h1 className='stats-warning'>
                                        Stats can be retrieved every 5 minutes to prevent overload. 
                                        For the most accurate data, please rate as many shows on MyAnimelist as you can.
                                        This includes score, start date and finish dates.
                                        <br/>
                                        <br/>
                                        If you're seeing this message due to a refresh or loading error, come back and try again later.
                                    </h1>
                                    <button className='get-stats-button' onClick={() => getUserStats(setLoading, setAPICallSuccess, setDataUser, category, setAPICallSuccesses)} disabled={category === -1}> Get my Stats </button>
                                </>
                                :
                                <>
                                    <div className='display-data-div'>
                                        {(() => {
                                            return statsDisplayFunction(category, dataDisplay, dataUser[category], dataMax);
                                        })()}
                                        <div className='switch-data-screen'>
                                            <button id='back-switch-data' className='switch-data-buttons' onClick={() => backSlide()} disabled={dataDisplay === 0}>
                                                ◀
                                            </button>
                                            <div className='data-slides'>
                                                {
                                                    Array.from({ length: dataMax.current }, (_, i) => (
                                                        <div key={i} className={i === dataDisplay ? "slide active-slide" : "slide"}
                                                        onClick={() => changeSlide(i)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <button id='forward-switch-data' className='switch-data-buttons' onClick={() => forwardSlide()}>
                                                ▶
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeStats;
export function notEnoughData() {
    return(
        <h1 className='data-h2'>
            Data unavailable. Add more shows to your list and rate them to unlock this data. Watch and rate more shows, then check back!
        </h1>
    );
}

// Generate random color for the graph
export function graphGetColor() {
    const minBrightness = 60;
    
    const r = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const g = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const b = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;

    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    
    return hex;
}