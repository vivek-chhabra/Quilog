import React, { useContext } from "react";
import "./Home.scss";
import heroImg from "../../assets/hero-img.png";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
    const { user } = useContext(AuthContext);
    
    return (
        <div className="Home">
            <div className="container">
                <div className="content flex">
                    <div className="left flex-col">
                        <h1>"The secret to getting ahead is getting started."</h1>
                        {user && (
                            <NavLink to={"/create"} className="button create flex">
                                <span class="material-symbols-outlined">add</span> Create Blog
                            </NavLink>
                        )}
                        <NavLink to={"/read"} className="button read flex">
                            <span class="material-symbols-outlined">visibility</span> Read Blog
                        </NavLink>
                    </div>
                    <div className="right">
                        <img src={heroImg} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
