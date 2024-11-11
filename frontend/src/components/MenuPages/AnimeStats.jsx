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

// Generate random color for the graph
function graphGetColor() {
    const minBrightness = 60;
    
    const r = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const g = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
    const b = Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;

    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    
    return hex;
}

function AnimeStats() {
    const [APICallSuccess, setAPICallSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);
    const [dataDisplay, setDataDisplay] = useState(0);

    // Changing Slides
    const dataMax = 9;

    const backSlide = () => {
        if(dataDisplay > 0) {
            setDataDisplay(d => d - 1);
        }
    }

    const forwardSlide = () => {
        if(dataDisplay < dataMax) {
            setDataDisplay(d => d + 1);
        }
    }

    const changeSlide = (slide) => {
        setDataDisplay(slide);
    }


    // Effects For revealing information
    const [isYourScoreVisible, setYourScoreVisible] = useState(false);

    useEffect(() => {
        const yourScoreTimer = setTimeout(() => setYourScoreVisible(true), 5000);

        return () => {
            clearTimeout(yourScoreTimer);
        };
    }, []);

    // Structure for data
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
            <h2 className={`data-h2 ${isYourScoreVisible ? 'show-data' : 'hide-data'}`}>
                Your Average Rating is: <br/>
                {your_score}
            </h2>
        </>
        );
    }

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
                    You completed the most anime released in these years
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
                    <XAxis type="number" dataKey="average" domain={['auto', 10]}/>
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
                    Your Top 10 Genres by Count
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
                    Your Most Watched Studios
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
                        <XAxis type="number" dataKey="average" domain={['auto', 10]} />
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
                        <h1>Your Anime Stats</h1>
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
                                <h1 className='stats-warning'>
                                    Stats are refreshed every 5 minutes to prevent overload. 
                                    For the most accurate data, please rate all your shows on MyAnimeList or as many as you can.
                                    <br/>
                                    <br/>
                                    If you're seeing this message due to a refresh or loading error, give it a moment and try again.
                                </h1>
                                <button className='get-stats-button' onClick={() => getUserStats(setLoading, setAPICallSuccess, setData)}> Get my Stats </button>
                            </>
                            :
                            <>
                                <div className='display-data-div'>
                                {(() => {
                                    switch (dataDisplay) {
                                        case 0:
                                            return userVsMal(data["average_rating"]["mal_score"], data["average_rating"]["your_score"]);

                                        case 1:
                                            return RatingPieChart(data['popular_ratings']);

                                        case 2:
                                            return animeYears(data['season_anime']);

                                        case 3:
                                            return animeSourcesChart(data['sources'])

                                        case 4:
                                            return top10GenresByAvg(data['top_10_genres_avg']);

                                        case 5:
                                            return top10GenresByCount(data['top_10_genres_count']);

                                        case 6:
                                            return mostWatchedStudios(data['top_10_studios_count']);

                                        case 7:
                                            return topStudiosAvg(data['top_10_studios_avg']);
                                        
                                        case 8:
                                            return top20Anime(data['top_20_anime']);

                                        default:
                                            return <div>No data available</div>;
                                    }
                                })()}
                                </div>
                                <div className='switch-data-screen'>
                                    <button className='switch-data-buttons' onClick={() => backSlide()}>
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
                                    <button className='switch-data-buttons' onClick={() => forwardSlide()}>
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