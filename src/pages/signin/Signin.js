import React, { useState } from "react";
import "./Signin.scss";
import logo from "../../assets/hero-img.png";
import { NavLink } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { message } from "../../utils/message";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // signin hook
    const { error, isPending, login } = useLogin(email, password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        login();
    };

    return (
        <>
            {error && message("danger", error)}
            <div className="Signin">
                <div className="container flex">
                    <div className="left flex-col">
                        <div className="head">Welcome</div>
                        <p>Login to your account</p>
                        <form action="/" className="flex-col" onSubmit={handleSubmit}>
                            <div className="top flex-col">
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="" placeholder="Enter your email" id="" />
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="" placeholder="Enter password" id="" />
                                <NavLink>Forget Password?</NavLink>
                            </div>
                            <div className="bottom flex-col">
                                {isPending ? (
                                    <div className="button">
                                        <div className="spinner-border text-dark" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="submit">Login</button>
                                )}
                                <div className="signup">
                                    Don't have an account? <NavLink to="/signup">Register</NavLink>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="right flex-col">
                        <h1>Let's Blog it</h1>
                        <img src={logo} alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}
