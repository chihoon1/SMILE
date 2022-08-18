import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    // created this part for testing. and fixed session ID to 1 for testing
    return (
        <Link to={`/${12}`}>
            join Group
        </Link>
    );
}

export default Home;