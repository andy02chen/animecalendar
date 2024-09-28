import './ProgressContainer.css'
import defaultpfp from '../imgs/defaultpfp.png';

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

function ProgressContainer() {
    return(
        <>
            <div id="progress-container" style={{display: 'none'}}>
                <div className='progress-div1'>
                    <svg className='progress-div1-svg' viewBox="0 0 336 996" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"> 
                    <path d="M18.241 3L3 25.8462V993H16.3359L30.7386 957.573L305.597 957.574L319.568 993H333.221V3H18.241Z" fill="#1A344E" stroke="#1891FF" stroke-width="5"/>
                    <path d="M32.3527 959.602L18.1895 992.423H317.7L304.327 959.602H32.3527Z" fill="#CDA145" stroke="#1891FF"/>
                    <path d="M35.1045 985.498V972.039C37.6729 964.861 40.4553 969.048 41.5255 972.039V985.498C38.2232 996.265 35.8689 989.984 35.1045 985.498Z" fill="#E2C893"/>
                    <path d="M43.3594 985.498V972.039C45.9278 964.861 48.7102 969.048 49.7803 972.039V985.498C46.4781 996.265 44.1238 989.984 43.3594 985.498Z" fill="#E2C893"/>
                    <path d="M51.6162 985.498V972.039C54.1846 964.861 56.967 969.048 58.0372 972.039V985.498C54.735 996.265 52.3806 989.984 51.6162 985.498Z" fill="#E2C893"/>
                    <path d="M68.1279 985.498V972.039C70.6963 964.861 73.4787 969.048 74.5489 972.039V985.498C71.2467 996.265 68.8923 989.984 68.1279 985.498Z" fill="#E2C893"/>
                    <path d="M76.3818 985.498V972.039C78.9502 964.861 81.7326 969.048 82.8028 972.039V985.498C79.5006 996.265 77.1462 989.984 76.3818 985.498Z" fill="#E2C893"/>
                    <path d="M95.6455 985.498V972.039C98.2139 964.861 100.996 969.048 102.066 972.039V985.498C98.7643 996.265 96.4099 989.984 95.6455 985.498Z" fill="#E2C893"/>
                    <path d="M110.321 985.498V972.039C112.89 964.861 115.672 969.048 116.742 972.039V985.498C113.44 996.265 111.086 989.984 110.321 985.498Z" fill="#E2C893"/>
                    <path d="M132.336 985.498V972.039C134.904 964.861 137.687 969.048 138.757 972.039V985.498C135.455 996.265 133.1 989.984 132.336 985.498Z" fill="#E2C893"/>
                    <path d="M121.33 985.498V972.039C123.898 964.861 126.681 969.048 127.751 972.039V985.498C124.449 996.265 122.094 989.984 121.33 985.498Z" fill="#E2C893"/>
                    <path d="M158.021 985.498V972.039C160.589 964.861 163.371 969.048 164.441 972.039V985.498C161.139 996.265 158.785 989.984 158.021 985.498Z" fill="#E2C893"/>
                    <path d="M166.275 985.498V972.039C168.844 964.861 171.626 969.048 172.696 972.039V985.498C169.394 996.265 167.04 989.984 166.275 985.498Z" fill="#E2C893"/>
                    <path d="M174.531 985.498V972.039C177.1 964.861 179.882 969.048 180.952 972.039V985.498C177.65 996.265 175.296 989.984 174.531 985.498Z" fill="#E2C893"/>
                    <path d="M182.787 985.498V972.039C185.355 964.861 188.138 969.048 189.208 972.039V985.498C185.906 996.265 183.552 989.984 182.787 985.498Z" fill="#E2C893"/>
                    <path d="M208.471 985.498V972.039C211.039 964.861 213.822 969.048 214.892 972.039V985.498C211.589 996.265 209.235 989.984 208.471 985.498Z" fill="#E2C893"/>
                    <path d="M216.726 985.498V972.039C219.294 964.861 222.076 969.048 223.147 972.039V985.498C219.844 996.265 217.49 989.984 216.726 985.498Z" fill="#E2C893"/>
                    <path d="M231.402 985.498V972.039C233.971 964.861 236.753 969.048 237.823 972.039V985.498C234.521 996.265 232.167 989.984 231.402 985.498Z" fill="#E2C893"/>
                    <path d="M242.41 985.498V972.039C244.979 964.861 247.761 969.048 248.831 972.039V985.498C245.529 996.265 243.175 989.984 242.41 985.498Z" fill="#E2C893"/>
                    <path d="M253.419 985.498V972.039C255.987 964.861 258.77 969.048 259.84 972.039V985.498C256.538 996.265 254.183 989.984 253.419 985.498Z" fill="#E2C893"/>
                    <path d="M283.689 985.498V972.039C286.258 964.861 289.04 969.048 290.11 972.039V985.498C286.808 996.265 284.454 989.984 283.689 985.498Z" fill="#E2C893"/>
                    <path d="M294.696 985.498V972.039C297.265 964.861 300.047 969.048 301.117 972.039V985.498C297.815 996.265 295.461 989.984 294.696 985.498Z" fill="#E2C893"/>
                    <line x1="38.1914" y1="970.069" x2="38.1914" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="46.4463" y1="970.069" x2="46.4463" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="54.7021" y1="970.069" x2="54.7021" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="71.2139" y1="970.069" x2="71.2139" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="79.4697" y1="970.069" x2="79.4697" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="98.7305" y1="970.069" x2="98.7305" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="113.408" y1="970.069" x2="113.408" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="124.416" y1="970.069" x2="124.416" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="135.423" y1="970.069" x2="135.423" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="161.107" y1="970.069" x2="161.107" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="169.363" y1="970.069" x2="169.363" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="177.619" y1="970.069" x2="177.619" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="185.874" y1="970.069" x2="185.874" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="211.557" y1="970.069" x2="211.557" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="219.812" y1="970.069" x2="219.812" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="234.487" y1="970.069" x2="234.487" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="245.497" y1="970.069" x2="245.497" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="256.505" y1="970.069" x2="256.505" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="286.773" y1="970.069" x2="286.773" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    <line x1="297.783" y1="970.069" x2="297.783" y2="960.1" stroke="#E2C893" stroke-width="3"/>
                    </svg>

                    <div className='progress-content-div'>
                        <div className='progress-header-div'>
                            <h1>YOUR LIST</h1>
                            <div className='progress-settings-div'>
                                <button className='progress-settings-buttons'>
                                    <img src={defaultpfp}></img>
                                    <p className='progress-settings-title'>&nbsp;Username</p>
                                    <svg className='progress-settings-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                                </button>
                            </div>
                        </div>
                        <div className='progress-note'>
                            <p>Note: Release times are based on MAL data and may differ from those on your streaming platform.</p>
                        </div>
                        <svg className='progress-top-divider' viewBox="0 0 469 47" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='none'>
                        <rect x="0.5" y="9.84998" width="5.33212" height="2.13333" fill="#EBD8B3"/>
                        <rect x="11.1643" y="8.78333" width="293.267" height="4.26667" fill="#EBD8B3"/>
                        <path d="M16.6381 6.65L8.56909 0.25H19.3277L23.3622 3.45L27.3967 6.65H16.6381Z" fill="#79BFFF"/>
                        <path d="M32.776 6.65L24.707 0.25H35.4657L39.5001 3.45L43.5346 6.65H32.776Z" fill="#79BFFF"/>
                        <path d="M48.9139 6.65L40.845 0.25H51.6036L55.6381 3.45L59.6726 6.65H48.9139Z" fill="#79BFFF"/>
                        <path d="M128.295 46.75L118.845 42.4833H459.05L468.5 46.75H128.295Z" fill="#AEBCC5"/>
                        <path d="M324.604 38.2167L316.451 28.6167L332.756 28.6167L324.604 38.2167Z" fill="#0F589C"/>
                        </svg>
                    </div>
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
        </>
    );
}

export default ProgressContainer;