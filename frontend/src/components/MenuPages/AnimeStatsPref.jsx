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
    
    console.log(data);

    switch(whichDisplay) {
        case 0:
            if(data['sources'] && data['sources'].length > 0) {
                return animeSourcesChart(data['sources']);
            }

        case 5:
            if(data['popular_years'] && data['popular_years'].length > 0) {
                return animeYears(data['popular_years']);
            }

        default:
            return notEnoughData();
    }
}

export default AnimeStatsPref;