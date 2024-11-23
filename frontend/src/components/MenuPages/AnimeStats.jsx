import { useState, useEffect } from 'react';
import './AnimeStats.css';
import axios from 'axios';
import React from 'react';

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';

function closeStats() {
    const div = document.getElementById('anime-stats-page');
    if(div.style.display === 'flex') {
        div.style.display = 'none'
    }
}

// Calls api
function getUserStats(setLoading, setAPICallSuccess, setData) {
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

function notEnoughData() {
    return(
        <h1 className='data-h2'>
            Data unavailable. Add more shows to your list and rate them to unlock this data. Watch and rate more shows, then check back!
        </h1>
    );
}

// Generate random color for the graph
function graphGetColor() {
    const minBrightness = 60;
    
    const r = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const g = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const b = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;

    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    
    return hex;
}

// Display stats related to score data
function scoringStats(whichDisplay, data) {
    // User vs Mal Average Rating HTML
    const userVsMal = (mal_score, your_score) => {
        return(
        <>
            <h1 className='data-h1'>
                Are you a harsh critic?<br/>
                Your Average Rating vs MAL Average
            </h1>
            <h2 className='data-h2'>
                The average score for the animes you have rated is: <br/>
                {mal_score}
            </h2>
            <h2 className={`data-h2`}>
                Your Average Rating is: <br/>
                {your_score}
            </h2>
        </>
        );
    }

    // Very Good Rating HTML
    const veryGood = (percentage) => {
        return(
            <>
                <h1 className='data-h1'>
                    A Rating of 8 is considered "Very Good" on Mal<br/>
                </h1>
                <h2 className='data-h2'>
                    Around <span className='yellow-stat'>{percentage}%</span> of your anime are rated an 8 or higher
                </h2>
            </>
        )
    }

    // Lowest Rated anime HTML
    const lowestRatedAnime = (anime) => {
        return(
            <>
                <h1 className='data-h1'>
                    Here are 3 of your lowest rated anime
                </h1>
                <div className='stats-div-of-anime'>
                    {
                        anime.map((entry, index) => (
                            <React.Fragment key={index}>
                                <div>
                                    <div className='top-anime-left'>
                                        <h2 className='data-h2'>
                                            {index+1}.
                                        </h2>
                                    </div>
                                    <div className='top-anime-right'>
                                        <div className='top-anime-header'>
                                            <h2 className='data-h2'>
                                                <span className='yellow-stat'>{entry['title']}</span>
                                            </h2>
                                            <img className='top-20-anime-img' src={entry['image']}/>
                                        </div>
                                        <h2 className='data-h2'>
                                            Your Score: {entry['your_score']}
                                        </h2>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </>
        )
    }

    // Average Rating last 2 Years
    const averageRatingLastYear = (rating) => {
        return(
            <>
                <h1 className='data-h1'>
                    The average score you have given for anime over the past year, as of this date last year, is:<br/>
                </h1>
                <h2 className='data-h2'>
                    <span className='yellow-stat'>{rating}</span>
                </h2>
            </>
        );
    }

    switch(whichDisplay) {
        case 0:
            if(data["you_vs_mal"] && data["you_vs_mal"]["mal_score"] && data["you_vs_mal"]["your_score"]) {
                return userVsMal(data["you_vs_mal"]["mal_score"], data["you_vs_mal"]["your_score"]);
            }

            return notEnoughData();

        case 1:
            if(data['average_rating_last_year']) {
                return averageRatingLastYear(data['average_rating_last_year']);
            }

            return notEnoughData();

        case 2:
            if(data["very_good_ratings"]) {
                return veryGood(data['very_good_ratings']);
            }

            return notEnoughData();

        case 3:
            if(data["lowest_rated"] && data['lowest_rated']['0']) {
                return lowestRatedAnime(data['lowest_rated']);
            }

            return notEnoughData();
    }
}

// Displays the stats
function statsDisplayFunction(whichCategory, whichDisplay, data) {

    switch(whichCategory) {
        // Stats related to Scoring
        case 0:
            return scoringStats(whichDisplay, data);
    }
}

function AnimeStats() {
    const [APICallSuccess, setAPICallSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);
    const [dataDisplay, setDataDisplay] = useState(0);
    const [category, setCategory] = useState(0);
    const [dataMax, setDataMax] = useState(4);

    if(localStorage.getItem('username') === "Guest") {
        setDataMax(5);
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

        if(dataDisplay < dataMax - 2) {
            if(front.disabled) {
                front.removeAttribute('disabled');
            }
        } else if (dataDisplay === (dataMax - 2)) {
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
        } else if (slide === (dataMax - 1)) {
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

    const top10GenresByAvg = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Your Top 10 Genres by Average Rating
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-10-average-bar-chart">
                    <XAxis type="number" dataKey="average"/>
                    <YAxis type="category" dataKey="genre" width={100} />
                    <Tooltip/>
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

    const top20Anime = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Your Top 20 Highest Rated Anime
                </h1>
                <div className='top-20-anime'>
                    {data.map((entry, index) => (
                        <React.Fragment key={index}>
                            <div>
                                <div className='top-anime-left'>
                                    <h2 className='data-h2'>
                                        {index+1}.
                                    </h2>
                                </div>
                                <div className='top-anime-right'>
                                    <div className='top-anime-header'>
                                        <h2 className='data-h2'>
                                            <span className='yellow-stat'>{entry['title']}</span>
                                        </h2>
                                        <img className='top-20-anime-img' src={entry['img']}/>
                                    </div>
                                    <h2 className='data-h2'>
                                        MAL Score: {entry['mal_score']}
                                    </h2>
                                    <h2 className='data-h2'>
                                        Your Score: {entry['your_score']}
                                    </h2>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </>
        );
    }

    return(
        <div id='anime-stats-page' className='menu-page-hold' style={{display: 'none'}}>
            <div className='menu-page-no-shape'>
                <div className='menu-page-content'>
                    <div className='menu-page-header'>
                        {localStorage.getItem('username') === "Guest" ?
                            <h1>Demo Anime Stats</h1>
                            :
                            <h1>Your Anime Stats</h1>
                        }
                        <h1 className='menu-page-close-button' onClick={() => closeStats()}>&#10006;</h1>
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
                        (APICallSuccess === null || APICallSuccess === false || data === null ?
                            <>
                                {localStorage.getItem('username') === "Guest" ?
                                    <h1 className='stats-warning'>
                                        Stats can be retrieved every 5 minutes to prevent overload.
                                        <br/>
                                        As you are a guest the anime stats will be taken from Andy's public data on MyAnimelist.
                                        If you would like your anime stats, please login to your MyAnimeList account.
                                        <br/>
                                        <br/>
                                        If you're seeing this message due to a refresh or loading error, give it a moment and try again.
                                    </h1>
                                    :
                                    <h1 className='stats-warning'>
                                        Stats can be retrieved every 5 minutes to prevent overload. 
                                        For the most accurate data, please rate as many shows on MyAnimelist as you can.
                                        This includes score, start date and finish dates.
                                        <br/>
                                        <br/>
                                        If you're seeing this message due to a refresh or loading error, give it a moment and try again.
                                    </h1>
                                }
                                {localStorage.getItem('username') === "Guest" ?
                                    <button className='get-stats-button' onClick={() => getUserStats(setLoading, setAPICallSuccess, setData)}> Get Stats </button>
                                    :
                                    <button className='get-stats-button' onClick={() => getUserStats(setLoading, setAPICallSuccess, setData)}> Get my Stats </button>
                                }
                            </>
                            :
                            <>
                                <div className='display-data-div'>
                                    {localStorage.getItem('username') === "Guest" ?
                                        (() => {
                                            switch (dataDisplay) {
                                                case 0:
                                                    return top10GenresByCount(data['top_10_genres_count']);

                                                case 1:
                                                    return RatingPieChart(data['popular_ratings']);

                                                case 2:
                                                    return animeYears(data['season_anime']);

                                                case 3:
                                                    return animeSourcesChart(data['sources'])

                                                case 4:
                                                    return mostWatchedStudios(data['top_10_studios_count']);

                                                default:
                                                    return <div>No data available</div>;
                                            }
                                        })()
                                        :
                                        (() => {
                                            return statsDisplayFunction(category, dataDisplay, data);
                                            // switch (dataDisplay) {
                                            //     case 0:
                                            //         if(data["average_rating"] && data["average_rating"]["mal_score"] && data["average_rating"]["your_score"]) {
                                            //             return userVsMal(data["average_rating"]["mal_score"], data["average_rating"]["your_score"]);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 1:
                                            //         if(data['popular_ratings']) {
                                            //             return RatingPieChart(data['popular_ratings']);
                                            //         }
                                                    
                                            //         return notEnoughData();

                                            //     case 2:
                                            //         if(data['season_anime']) {
                                            //             return animeYears(data['season_anime']);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 3:
                                            //         if(data['sources']) {
                                            //             return animeSourcesChart(data['sources']);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 4:
                                            //         if(data['top_10_genres_avg']) {
                                            //             return top10GenresByAvg(data['top_10_genres_avg']);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 5:
                                            //         if(data['top_10_genres_count']) {
                                            //             return top10GenresByCount(data['top_10_genres_count']);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 6:
                                            //         if(data['top_10_studios_count']) {
                                            //             return mostWatchedStudios(data['top_10_studios_count']);
                                            //         }

                                            //         return notEnoughData();

                                            //     case 7:
                                            //         if(data['top_10_studios_avg']) {
                                            //             return topStudiosAvg(data['top_10_studios_avg']);
                                            //         }

                                            //         return notEnoughData();
                                                
                                            //     case 8:
                                            //         if(data['top_20_anime']) {
                                            //             return top20Anime(data['top_20_anime']);
                                            //         }

                                            //         return notEnoughData();

                                            //     default:
                                            //         return <div>No data available</div>;
                                            // }
                                        })()
                                    }
                                    
                                </div>
                                <div className='switch-data-screen'>
                                    <button id='back-switch-data' className='switch-data-buttons' onClick={() => backSlide()}>
                                        ◀
                                    </button>
                                    <div className='data-slides'>
                                        {
                                            Array.from({ length: dataMax }, (_, i) => (
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
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeStats;