import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ContextProvider } from '../context/Context';
import { FiLogOut } from 'react-icons/fi';
import logo from "../assets/images/logo.png";
function Header(props) {
    const { user, handleLogout, getIdUser } = useContext(ContextProvider)
    const [avata, setAvatar] = useState("");
   
    // Chủ yếu phần này lấy và show avatar khi user đăng nhập
    useEffect(() => {
        setAvatar(user.displayName)
        if (avata) {
            const a = avata.slice(0, 1).toUpperCase()
            setAvatar(a)
        }
    })
 
    return (
        <div className="header">
            <div className="container header__inner">
                <div className="col-lg-8">
                    <div className="header__nav">
                        <div className="header__logo">
                            <Link to="/" className="header__logo-box">
                                <img className="header__logo-img" src={logo} alt="***"></img>
                                <p>coffie</p>
                            </Link>
                        </div>
                        {
                            user ?
                                <div className="header__logout">
                                    <Link to={`/profile/${user.uid}`} onClick={() => getIdUser(user.uid)} className="link-toolip">
                                        {
                                            user && user.photoURL === null ?
                                                <p className="header__user-avatar">{avata} </p> :
                                                <img src={user.photoURL} className="header__user-avatar" alt="***"></img>
                                        }
                                        <p className="toolip-profile">profile </p>
                                    </Link>
                                    <span onClick={handleLogout} className="btn-logout">
                                        <FiLogOut />
                                        <p className="tolip">Logout</p>
                                    </span>
                                </div>
                                :
                                <div className="header__login">
                                    <Link to="/login" >đăng nhập</Link>
                                </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Header;