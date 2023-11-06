import React, { useContext, useState } from "react";
import "./Profile.scss";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../context/AuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useStoreFile } from "../../hooks/useStoreFile";
import { message } from "../../utils/message";
import { useFirestore } from "../../hooks/useFirestore";

export default function Profile() {
    const [showAdd, setShowAdd] = useState(false);
    const { user } = useContext(AuthContext);
    const [formErr, setFormErr] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);

    const { error, document } = useCollection("blogs", "uid", `${user?.uid}`);
    const { error: fileErr, isPending, uploadFile } = useStoreFile();
    const {error: editErr, editDocument} = useFirestore();
    
    let likes = 0;
    let comments = 0;
    for (let doc of document) {
        likes += doc?.likes?.length;
    }
    for (let doc of document) {
        comments += doc?.comments?.length;
    }

    // profile upload
    const uploadProfile = async (e) => {
        setIsUpdated(false);
        let selected = e.target.files;
        setFormErr(null);
        const type = selected[0].type ? selected[0].type : "";

        if (!type.includes("image")) {
            setFormErr("Selected File Should be of Image Type");
            return;
        } else if (selected[0].size > 300000) {
            setFormErr("File Size Should Not Be Higher Than 300KBs");
            window.scrollTo(0, 0);
            return;
        }

        let res = await uploadFile(`files/profile/${user?.uid}/${selected[0].name}`, selected[0]);
        // await editDocument('blogs',)
        setIsUpdated(true);
    };

    return (
        <div style={{padding: '4rem 0rem'}}>
            {formErr && message("danger", formErr)}
            {fileErr && message("danger", fileErr)}
            {isUpdated && message("success", `Successfully update the profile, refresh the page to see changes if did'nt occurred`)}
            <div className="Profile">
                <div className="container flex">
                    <div className="left flex-col">
                        <div className="img flex" onMouseEnter={() => setShowAdd(true)} onMouseLeave={() => setShowAdd(false)}>
                            {showAdd ? (
                                <i class="fa-solid fa-plus">
                                    <input type="file" onChange={uploadProfile} />
                                </i>
                            ) : isPending ? (
                                <div className="spinner button">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <img src={user.photoURL ? user.photoURL : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} alt="" />
                            )}
                        </div>
                        <h1 className="name">{user.displayName}</h1>
                        <div className="hr"></div>
                        <div className="liked">Total likes: {likes}</div>
                        <div className="my-posts">Total comments: {comments}</div>
                        <div className="my-posts">My Blogs: {document?.length}</div>
                    </div>
                    <div className="line"></div>
                    <div className="right">
                        <img src={logo} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
