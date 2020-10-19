import React from 'react';
// import {
//     Link
// } from "react-router-dom";
// import { ContextProvider } from '../context/Context';

import Posts from './Posts';
import Header from './Header';
function Home(props) {
    return (
        <div className="home">
            <Header></Header>
            <Posts></Posts>
        </div>
    );
}

export default Home;