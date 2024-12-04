import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';


function AnimeStatsPref({whichDisplay, data}) {

    // Anime Sources display
    const animeSourcesChart = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Anime Sources
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                    <BarChart data={data} className='source-bar-chart'>
                        <XAxis dataKey="source" style={{ fill: '#FFFFFF'}}/>
                        <YAxis style={{ fill: '#FFFFFF'}}/>
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
                        {entry["year"]} <span className='yellow-stat'>- {entry['count']} completed</span>
                    </h2>
                ))}
            </>
        );
    }

    const mediaTypes = (data) => {
        return(
            <>
            <h1 className='data-h1'>
                Media Types
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

    const seasonDuration = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Do you prefer shorter or longer anime?
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                    <BarChart data={data} className='source-bar-chart'>
                        <XAxis style={{ fill: '#FFFFFF'}}
                            dataKey="Category" 
                            tickFormatter={(name) => {
                                if (name === 'Longer') return '15eps +';
                                if (name === 'Shorter') return '<= 14eps';
                                return name;
                            }} 
                        />
                        <YAxis style={{ fill: '#FFFFFF'}} />
                        <Tooltip />
                        <Bar dataKey="Total Count" name="Count">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={graphGetColor()} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </>
        )
    }

    const popularity = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Do you prefer popular anime?
                </h1>
                <h2 className='data-h2'>
                    The average popularity rank of your completed shows is <span className='yellow-stat'>{data['avg_pop']}</span>.
                </h2>
                <h2 className='data-h2'>
                    You have watched <span className='yellow-stat'>{data['top_200_pop']} out of top 200</span> most popular shows on MyAnimeList!
                </h2>
            </>
        );
    }

    switch(whichDisplay) {
        case 0:
            if(data['sources'] && data['sources'].length > 0) {
                return animeSourcesChart(data['sources']);
            }

            return notEnoughData();

        case 1:
            if(data['media_types'] && data['media_types'].length > 0) {
                return mediaTypes(data['media_types']);
            }

            return notEnoughData();

        case 2:
            if(data['season_length'] && data['season_length'].length > 0) {
                return seasonDuration(data['season_length']);
            }

            return notEnoughData();

        case 3:
            if(data['ratings'] && data['ratings'].length > 0) {
                return RatingPieChart(data['ratings']);
            }

            return notEnoughData();

        case 4:
            if(data['popularity'] && data['popularity']['avg_pop'] && data['popularity']['top_200_pop']) {
                return popularity(data['popularity']);
            }

            return notEnoughData();

        case 5:
            if(data['popular_years'] && data['popular_years'].length > 0) {
                return animeYears(data['popular_years']);
            }

            return notEnoughData();

        default:
            return notEnoughData();
    }
}

export default AnimeStatsPref;