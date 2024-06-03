import React, {useState, useEffect} from 'react'
import axios from "axios"

function loginRedirect() {
    window.location.href = `/a`
}

function HomePage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [hasLoaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.get("/api/check-login")
            .then(response => {
                setLoggedIn(response.data.loggedIn);
                setLoaded(true);
            })
            .catch(error => {
                setLoaded(true);
            });
    }, []);

    return(
        <>
            {hasLoaded ?
                <>
                    {isLoggedIn ?
                        <>
                            <h1>Home Page</h1>
                            <p>User is logged in.</p>
                        </>
                        :
                        <>
                            {loginRedirect()}
                        </>
                    }
                </>
                :
                <>
                    <p>Loading...</p>
                </>
            }
        </>
    );

    // if (isLoading) {
    //     return <p>Loading...</p>;
    // }

    // if (!isLoggedIn) {
    //     loginRedirect();
    //     return null;
    // }

    // return (
    //     <>
    //         <h1>Home Page</h1>
    //         <p>User is logged in.</p>
    //     </>
    // );
}

export default HomePage;