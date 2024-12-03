import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';

function AnimeStatsGenres({whichDisplay, data}) {

    // top genres by count
    const top10GenresByCount = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Top 10 Genres by <span className='yellow-stat'>Count</span>
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

    // top genres avg rating
    const top10GenresByAvg = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Your Top 10 Genres by <span className='yellow-stat'>Average Rating</span>
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-10-average-bar-chart">
                    <XAxis type="number" dataKey="average"/>
                    <YAxis type="category" dataKey="genre" width={100} />
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

    // Most watched genres this year
    const mostWatchedGenres = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Most watched genres in past <span className='yellow-stat'>12 Months</span>
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-10-count-bar-chart">
                    <XAxis type="number" dataKey="count"/>
                    <YAxis type="category" dataKey="genres" width={100} />
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

    // New genres explored this year
    const newGenres = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    New Genres you explored in past <span className='yellow-stat'>12 Months</span>
                </h1>
                {data.map((entry, index) => (
                    <h2 key={index} className='data-h2'>
                        {entry}
                    </h2>
                ))}
            </>
        )
    }

    // Least Watched genres
    const leastWatched = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Least watched genres
                </h1>
                {data.map((entry, index) => (
                    <h2 key={index} className='data-h2'>
                        {entry.genre} - <span className='yellow-stat'>{entry.count}</span>
                    </h2>
                ))}
            </>
        )
    }

    switch(whichDisplay) {
        case 0:
            if(data['top_10_genres_count'].length > 0) {
                return top10GenresByCount(data['top_10_genres_count']);
            }

            return notEnoughData();

        case 1:
            if(data['top_10_genres_avg'].length > 0) {
                return top10GenresByAvg(data['top_10_genres_avg']);
            }

            return notEnoughData();

        case 2:
            if(data['top_10_most_watched_this_year'].length > 0) {
                return mostWatchedGenres(data['top_10_most_watched_this_year']);
            }

            return notEnoughData();

        case 3:
            if(data['genres_this_year'].length > 0) {
                return newGenres(data['genres_this_year']);
            }

            return (
                <h1 className='data-h2'>
                    You've either explored all the genres listed on MyAnimeList or haven't discovered any new ones this year.
                </h1>
            );

        case 4:
            if(data['top_10_least_watched'].length > 0) {
                return leastWatched(data['top_10_least_watched']);
            }

            return notEnoughData();

        default:
            return notEnoughData();
    }
}

export default AnimeStatsGenres;