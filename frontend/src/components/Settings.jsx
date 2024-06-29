import settings from "./imgs/gear-solid.svg"
import dropDownArrow from "./imgs/caret-down-solid.svg"
import './Settings.css'
import axios from "axios";

function displayDropDown() {
    if(document.getElementById("dropdown-div").style.display === "none") {
        document.getElementById("dropdown-div").style.display = "flex";
    } else {
        document.getElementById("dropdown-div").style.display = "none";
    }
}

function logOut() {
    axios.delete('/api/logout')
        .then(response => {
            document.cookie = 'session=; Max-Age=-99999999;';
            window.location.href = response.data.redirect_url;
        })
}

function Settings() {
    return(
        <>
            <button className="button-style" onClick={() => displayDropDown()}>
                <img className="button-img" src={dropDownArrow} alt='Drop down'></img>
            </button>
            <div id="dropdown-div" style={{display: 'none'}}>
                <button className="button-style">
                    <img className="button-img" src={settings} alt='Settings'></img>
                </button>
                <button className="button-style" onClick={() => logOut()}>Log Out</button>
            </div>
        </>
    );
}

export default Settings;