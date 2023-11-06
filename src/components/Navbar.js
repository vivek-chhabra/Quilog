import React, { useContext } from "react";
import { NavLink, redirect } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { auth } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.scss";
import { message } from "../utils/message";

export default function Navbar() {
    const { error, isPending, logout } = useLogout();
    const { user } = useContext(AuthContext);

    // handleLogout
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="flex-col">
            <div className="Navbar flex">
                <div className="container flex">
                    <NavLink to={"/"} className="logo flex">
                        <i class="fa-brands fa-hive"></i>
                        <p>Quilog</p>
                    </NavLink>
                    <div className="right flex">
                        {user?.uid ? <NavLink onClick={handleLogout}>Logout</NavLink> : <NavLink to="/signin">Login or Singup</NavLink>}

                        <NavLink to={"/profile"} className={"flex"} style={{ alignItems: "center", justifyContent: "center", gap: "1rem", fontWeight: "600" }}>
                            {user && (
                                <div className="name">
                                    Hey, <span style={{ textTransform: "capitalize" }}>{user?.displayName?.split(" ")[0]}</span>
                                </div>
                            )}
                            <div className="img">
                                <img className="profile" src={user?.photoURL ? user?.photoURL : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt="" />
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
            {error && message("success", error.message)}
        </div>
    );
}
