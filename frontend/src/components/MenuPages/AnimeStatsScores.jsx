import './AnimeStats.css';
import React from 'react';
import { notEnoughData } from './AnimeStats';

function AnimeStatsScores({whichDisplay, data}) {
    // User vs Mal Average Rating HTML
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
            <h2 className={`data-h2`}>
                Your Average Rating is: <br/>
                {your_score}
            </h2>
        </>
        );
    }

    // Very Good Rating HTML
    const veryGood = (percentage) => {
        return(
            <>
                <h1 className='data-h1'>
                    A Rating of 8 is considered "Very Good" on Mal<br/>
                </h1>
                <h2 className='data-h2'>
                    Around <span className='yellow-stat'>{percentage}%</span> of your anime are rated an 8 or higher
                </h2>
            </>
        )
    }

    // Lowest Rated anime HTML
    const lowestRatedAnime = (anime) => {
        return(
            <>
                <h1 className='data-h1'>
                    Here are 3 of your lowest rated anime
                </h1>
                <div className='stats-div-of-anime'>
                    {
                        anime.map((entry, index) => (
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
                                            <img className='top-20-anime-img' src={entry['image']}/>
                                        </div>
                                        <h2 className='data-h2'>
                                            Your Score: {entry['your_score']}
                                        </h2>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </>
        )
    }

    // Average Rating last 2 Years
    const averageRatingLastYear = (rating) => {
        return(
            <>
                <h1 className='data-h1'>
                    The average score you have given for anime over the past year, as of this date last year, is:<br/>
                </h1>
                <h2 className='data-h2'>
                    <span className='yellow-stat'>{rating}</span>
                </h2>
            </>
        );
    }

    // Top 20 anime
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
                                        <img className='top-20-anime-img' src={entry['image']}/>
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

    switch(whichDisplay) {
        case 0:
            if(data["you_vs_mal"] && data["you_vs_mal"]["mal_score"] && data["you_vs_mal"]["your_score"]) {
                return userVsMal(data["you_vs_mal"]["mal_score"], data["you_vs_mal"]["your_score"]);
            }

            return notEnoughData();

        case 1:
            if(data['average_rating_last_year']) {
                return averageRatingLastYear(data['average_rating_last_year']);
            }

            return notEnoughData();

        case 2:
            if(data["very_good_ratings"]) {
                return veryGood(data['very_good_ratings']);
            }

            return notEnoughData();

        case 3:
            if(data["lowest_rated"] && data['lowest_rated']['0']) {
                return lowestRatedAnime(data['lowest_rated']);
            }

            return notEnoughData();

        case 4:
            if(data['top_20_anime'].length > 0) {
                return top20Anime(data['top_20_anime']);
            }

        default:
            return notEnoughData();
    }
}

export default AnimeStatsScores;