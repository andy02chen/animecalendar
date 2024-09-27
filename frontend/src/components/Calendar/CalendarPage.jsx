import './CalendarPage.css'

// Display Progress Container and hide expand div
function expandProgressContainer() {
    const div = document.getElementById("progress-container");
    const expandDiv = document.getElementById("expand-progress-container");
    const collapseDiv = document.getElementById("collapse-progress-container");

    div.style.display = "block";
    expandDiv.style.display = "none";
    collapseDiv.style.display = "block";
}

// Hide progress Container and hide collapse div
function collapseProgressContainer() {
    const div = document.getElementById("progress-container");
    const expandDiv = document.getElementById("expand-progress-container");
    const collapseDiv = document.getElementById("collapse-progress-container");

    div.style.display = "none";
    expandDiv.style.display = "block";
    collapseDiv.style.display = "none";
}

function CalendarPage() {

    return(
        <div className='appPage'>
            <div id="progress-container" style={{display: 'none'}}>
                <div className='progress-div1'>
                    <div id='collapse-progress-container' >
                        <div class="trapezium2" onClick={() => collapseProgressContainer()}>
                            <span class="arrow">
                                &lt;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id='expand-progress-container'>
                <div class="trapezium" onClick={() => expandProgressContainer()}>
                    <span class="arrow">
                        &gt;
                    </span>
                </div>
            </div>
            <div className="calendar-container"></div>
        </div>
    );
}

export default CalendarPage;