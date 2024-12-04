import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';


function AnimeStatsPref({whichDisplay, data}) {

    console.log(data);

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

    switch(whichDisplay) {
        case 0:
            if(data['sources'] && data['sources'].length > 0) {
                return animeSourcesChart(data['sources']);
            }

        default:
            return notEnoughData();
    }
}

export default AnimeStatsPref;