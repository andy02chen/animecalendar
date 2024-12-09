
import './AnimeStats.css';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import { notEnoughData, graphGetColor } from './AnimeStats';

function AnimeStatsViewing({whichDisplay, data}) {

    // this_year
    const this_year = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Stats for the Past 365 Days
                </h1>
                <h2 className='data-h2'>
                    You've completed <span className='yellow-stat'>{data['shows']}</span> anime.<br/>
                    In total, you've watched <span className='yellow-stat'>{data['eps']}</span> episodes.<br/>
                    Assuming you don't skip OP and EDs, you've spent approximately <span className='yellow-stat'>{data['duration']}</span> minutes watching anime.
                </h2>
            </>
        )
    }

    // Average completion time
    const averageCompletion = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Are You a Binge-Watcher or a Weekly Viewer? (Average Completion Time)
                </h1>
                <h2 className='data-h2'>
                    On average, it takes you <span className='yellow-stat'>{data}</span> days to complete an anime series. Movies and TV specials are excluded from this calculation.
                </h2>
            </>
        )
    }

    switch(whichDisplay) {
        case 0:
            if(data['this_year'] && data['this_year']['duration'] && data['this_year']['eps'] && data['this_year']['shows']) {
                return this_year(data['this_year']);
            }

            return notEnoughData();

        case 1:
            if(data['avg_completion']) {
                return averageCompletion(data['avg_completion']);
            }

            return notEnoughData();

        default:
            return notEnoughData();
    }
}

export default AnimeStatsViewing;