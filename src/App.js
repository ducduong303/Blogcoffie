import React, { useContext} from 'react';
import '../src/assets/css/style.scss';
import Home from './components/Home';
import {
    // BrowserRouter as Router,
    Route,
} from "react-router-dom";
import Login from './components/Login';
import { ContextProvider } from './context/Context';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile';
import Loading from './components/Loading';
import Intro from './components/Intro';
;
function App() {
    const { idPost, idUser, loading } = useContext(ContextProvider);
 

    return (
        <div className="App">
            {loading ? <Loading></Loading> : ""}
            <Route exact path="/">
                {loading ? <Loading></Loading> : ""}
                <Home></Home>
            </Route>
            <Route path="/login">
                <Login></Login>
            </Route>
            <Route path={`/postdetail/${idPost}`}>
                <PostDetail></PostDetail>
            </Route>
            <Route path={`/profile/${idUser}`}>
                <Profile></Profile>
            </Route>
            {/* <Route path={`/gioithieu`}>
                <Intro></Intro>
            </Route> */}

        </div>
    );
}

export default App;
