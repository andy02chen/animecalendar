import './NextEpisodeStatus.css';

function NextEpisodeStatus({anime, type}) {
    console.log(anime);
    if(type === 'ptw') {
        return(
            <p>PlaceHolder text for plan to watch</p>
        );
    } else if (type === 'cw') {
        return(
            <p>PlaceHolder text for watching anime</p>
        );
    }
    return(null);
}

export default NextEpisodeStatus;