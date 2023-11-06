import { AuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Create from "./pages/createBlog/Create";
import Profile from "./pages/profile/Profile";
import Signup from "./pages/signup/Signup";
import Signin from "./pages/signin/Signin";
import Navbar from "./components/Navbar";
import { auth } from "./firebase/config";
import Home from "./pages/home/Home";
import Feed from "./pages/feed/Feed";
import { useContext } from "react";
import "./App.scss";

function App() {
    const { user, isAuthReady } = useContext(AuthContext);

    return (
        isAuthReady && (
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={!user ? <Signin /> : <Navigate to={"/"} />} />
                    <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to={"/signin"} />} />
                    <Route path="/create" element={user ? <Create /> : <Navigate to={"/signin"} />} />
                    <Route path="/blog/:id/edit" element={user ? <Create /> : <Navigate to={"/signin"} />} />
                    <Route path="/read" element={<Feed />} />
                </Routes>
            </div>
        )
    );
}

export default App;
