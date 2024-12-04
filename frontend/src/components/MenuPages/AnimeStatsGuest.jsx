import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';

function AnimeStatsGuest({dataDisplay, data}) {
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

    const errorDisplay = () => {
        return(<h1 className='data-h2'>
            There was an issue with retrieving data. Please try again later.
        </h1>)
    }
    
    switch (dataDisplay) {
        case 0:
            if(data['top_10_genres_count'] && data['top_10_genres_count'].length > 0) {
                return top10GenresByCount(data['top_10_genres_count']);
            }

            return errorDisplay();

        case 1:
            if(data['popular_ratings'] && data['popular_ratings'].length > 0) {
                return RatingPieChart(data['popular_ratings']);
            }

            return errorDisplay();

        case 2:
            if(data['season_anime'] && data['season_anime'].length > 0) {
                return animeYears(data['season_anime']);
            }

            return errorDisplay();

        case 3:
            if(data['sources'] && data['sources'].length > 0) {
                return animeSourcesChart(data['sources']);
            }

            return errorDisplay();

        case 4:
            if(data['top_10_studios_count'] && data['top_10_studios_count'].length > 0) {
                return mostWatchedStudios(data['top_10_studios_count']);
            }

            return errorDisplay();

        default:
            return <div>No data available</div>;
    }
}

export default AnimeStatsGuest;