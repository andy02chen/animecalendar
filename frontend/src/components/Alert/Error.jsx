import './Error.css';

function closeError() {
    document.getElementById('error-message-alert').classList.remove('show');
}

function Error() {
    return(
        <div className='error-alert-div-shape' id='error-message-alert'>
            <div className='error-alert-div-contents'>
                <div className='error-alert-header-div'>
                    <h1>Error</h1>
                    <h1 className='error-close-button' onClick={() => closeError()}>&#10006;</h1>
                </div>
                <div className='error-divider'><div></div></div>
                <div className='error-alert-message'>
                    Placeholder Message
                </div>
            </div>
        </div>
    );
}

export default Error;