
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

    switch(whichDisplay) {
        case 0:
            if(data['this_year'] && data['this_year']['duration'] && data['this_year']['eps'] && data['this_year']['shows']) {
                return this_year(data['this_year']);
            }

            return notEnoughData();

        default:
            return notEnoughData();
    }
}

export default AnimeStatsViewing;