
function AnimeAvailableDate({anime}) {
    const nextEpDate = new Date(anime.start_date);

    let daysToAdd = 7 * anime.eps_watched;
    nextEpDate.setDate(nextEpDate.getDate() + daysToAdd);
    
    const dateNow = Date.now();
    let diffMs = nextEpDate - dateNow;
    let days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    console.log(nextEpDate);

    return(
        <p>{days > 0 ? `The next episode will be available in ${days} days` : "Next Ep Available Now"}</p>
    );
}

export default AnimeAvailableDate;