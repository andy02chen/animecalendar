import settings from "./imgs/gear-solid.svg"

function Settings() {

    const styles = {
        width: "80px",
        height: "40px"
    };

    const imgStyles = {
        maxWidth: "100%",
        height: "100%"
    };

    return(
        <>
            <button style={styles}>
                <img style={imgStyles} src={settings} alt='Manage Settings'></img>
            </button>
        </>
    );
}

export default Settings;