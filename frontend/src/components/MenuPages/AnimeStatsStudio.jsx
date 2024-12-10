
import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';

function AnimeStatsStudio({whichDisplay, data}) {
    const mostWatchedStudios = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Most Watched Studios
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                <BarChart layout="vertical" data={data} className="top-studios-count">
                    <XAxis type="number" dataKey="count" style={{ fill: '#FFFFFF'}}/>
                    <YAxis type="category" dataKey="studio_name" width={100} style={{ fill: '#FFFFFF'}}/>
                    <Tooltip 
                    contentStyle={{
                        backgroundColor: '#3FA4FF',
                        border: '1px solid #3FA4FF'
                    }}
                    />
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

    // top studios by average
    const topStudiosAvg = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Top 10 Studios by Average Rating
                </h1>
                <ResponsiveContainer width="90%" height="80%" minWidth="18.75rem">
                    <BarChart layout="vertical" data={data} className="top-10-average-bar-chart">
                        <XAxis type="number" dataKey="average" style={{ fill: '#FFFFFF'}}/>
                        <YAxis type="category" dataKey="studio_name" width={100} style={{ fill: '#FFFFFF'}}/>
                        <Tooltip formatter={(value, name, props) => {
                            const count = props.payload.count;
                            return `${value}, Count: ${count}`;
                        }}
                        contentStyle={{
                            backgroundColor: '#3FA4FF',
                            border: '1px solid #3FA4FF'
                        }}
                        />
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

    switch(whichDisplay) {
        case 0:
            if(data['top_10_studios_count'] && data['top_10_studios_count'].length > 0) {
                return mostWatchedStudios(data['top_10_studios_count']);
            }

        case 1:
            if(data['top_10_studios_avg'] && data['top_10_studios_avg'].length > 0) {
                return topStudiosAvg(data['top_10_studios_avg']);
            }

        default:
            return notEnoughData();
    }
}

export default AnimeStatsStudio