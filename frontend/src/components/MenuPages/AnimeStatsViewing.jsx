
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

    // Shortest Completion time
    const shortest = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Shortest Completion Time
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
                                        Completed in {entry['completion_time']} day(s)
                                    </h2>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </>
        )
    }

    // longest Completion time
    const longest = (data) => {
        return(
            <>
                <h1 className='data-h1'>
                    Longest Completion Time
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
                                        Completed in {entry['completion_time']} day(s)
                                    </h2>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
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

        case 2:
            if(data['shortest_completion'] && data['shortest_completion'].length > 0) {
                return shortest(data['shortest_completion'])
            }

            return notEnoughData();
        
        case 3:
            if(data['longest_completion'] && data['longest_completion'].length > 0) {
                return longest(data['longest_completion'])
            }

            return notEnoughData();

        default:
            return notEnoughData();
    }
}

export default AnimeStatsViewing;