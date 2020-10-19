import React, { useContext, useState } from 'react';
import { ContextProvider } from '../context/Context';
import logo from "../assets/images/logo.png";
function Login(props) {
    const { open, toggleOpen, handleLogin, handleRegister, LoaderTrue,} = useContext(ContextProvider);

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",

    })
    const clearInput = () => {
        setInputs({
            username: "",
            email: "",
            password: "",

        })
    }
    const handleInput = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleInputLogin = () => {
        if (inputs.email === "" && inputs.password === "") {
            alert("bạn chưa nhập gì")
            return;
        }
        LoaderTrue()
        setTimeout(() => {
            handleLogin(inputs);
            clearInput();
        },0)
    }

    const handleInputRegister = () => {
        if (inputs.username.length < 15) {
            handleRegister(inputs);
            clearInput();
        }
        else {
            alert("username không được quá 15 ký tự")
        }

    }
    return (
        <div className="login">
            {
                open ?
                    <div className="login__inner">
                        <div className="login__form">
                            <div className="login__logo">
                                <img src={logo} alt="avatar"></img>
                            </div>
                            <h4 className="login__title">chào mừng cậu ghé thăm thế giới của Tớ</h4>
                            <div className="login__input">
                                <input type="email"
                                    onChange={handleInput}
                                    name="email"
                                    value={inputs.email}
                                    placeholder="email" />
                                <input type="password"
                                    name="password"
                                    onChange={handleInput}
                                    value={inputs.password}
                                    placeholder="password"></input>

                                <div className="login__box">
                                    <button onClick={handleInputLogin}>đăng nhập</button>
                                    <button onClick={toggleOpen}>đăng ký </button>
                                </div>
                                <small onClick={toggleOpen}>Tạo một tài khoản ?</small>
                            </div>
                        </div>
                    </div>

                    :
                    <div className="login__inner">
                        <div className="login__form">
                            <div className="login__logo">
                                <img src={logo} alt="/"></img>
                            </div>
                            <h4 className="login__title">chào mừng cậu ghé thăm thế giới của Tớ</h4>
                            <div className="login__input">
                                <input type="text"
                                    name="username"
                                    value={inputs.username}
                                    onChange={handleInput}
                                    placeholder="username"></input>
                                <input type="email"
                                    name="email"
                                    value={inputs.email}
                                    onChange={handleInput}
                                    placeholder="email"></input>
                                <input type="password"
                                    name="password"
                                    value={inputs.password}
                                    onChange={handleInput}
                                    placeholder="password"></input>
                                <div className="login__box">
                                    <button onClick={toggleOpen}>đăng nhập</button>
                                    <button onClick={handleInputRegister}>đăng ký</button>
                                </div>
                                <small >Điền thông tin thực nhé vì tớ muốn biết ?</small>

                            </div>
                        </div>
                    </div>

            }
        </div>
    );
}

export default Login;