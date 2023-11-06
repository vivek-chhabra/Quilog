import { AuthContext } from "../../context/AuthContext";
import React, { useContext, useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useLogin } from "../../hooks/useLogin";
import { message } from "../../utils/message";
import { auth } from "../../firebase/config";
import logo from "../../assets/hero-img.png";
import { NavLink } from "react-router-dom";
import "./Signup.scss";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [formErr, setFormErr] = useState(null);
    const [email, setEmail] = useState("");

    // signup hook
    const { error, isPending, signUp } = useSignup(firstName, lastName, email, password);
    const { error: googleErr, isPending: googlePen, googleLogin } = useLogin();
    const { user } = useContext(AuthContext);

    // signup with email and password
    const handleSubmit = async (e) => {
        e.preventDefault();

        // email validation
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9•-]+\.[a-z]{2,8}(.[a-z{2, 8}])?/g;
        if (!regEx.test(email)) {
            setFormErr("Email address is not valid")
            return;
        }
        else setFormErr(null);

        await signUp();
    };

    return (
        <>
            {error && message("danger", error)}
            {formErr && message("danger", formErr)}
            {googleErr && message("danger", googleErr)}

            <div className="Signup">
                <div className="container flex">
                    <div className="left flex-col">
                        <div className="head">Create an account</div>
                        <p>Let's blog it with Quilog</p>
                        <form action="/" className="flex-col" onSubmit={handleSubmit}>
                            <div className="top flex-col">
                                <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} name="" placeholder="firstName" id="firstName" />
                                <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} name="" placeholder="lastName" id="lastName" />
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="" placeholder="Email" id="" />
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="" placeholder="Password" id="" />
                            </div>
                            <div className="botton flex-col">
                                {isPending ? (
                                    <div className="spinner">
                                        <div className="spinner-border text-dark" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="submit" className="button">
                                        Create Account
                                    </button>
                                )}

                                <button className={"google"} onClick={() => googleLogin()}>
                                    <i class="fa-brands fa-google"></i>
                                    Sign up with google
                                </button>
                                <div className="signup">
                                    Don't have an account? <NavLink to="/signin">Login</NavLink>
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
