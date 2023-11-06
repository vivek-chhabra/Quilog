import { onSnapshot, getDoc, doc } from "firebase/firestore";
import { useCollection } from "../../hooks/useCollection";
import { AuthContext } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import React, { useContext, useEffect, useState } from "react";
import useDocument from "../../hooks/useDocument";
import { useNavigate } from "react-router-dom";
import { message } from "../../utils/message";
import useToggle from "../../hooks/useToggle";
import { auth, db } from "../../firebase/config";
import "./Feed.scss";

export default function Feed() {
    const [showCmt, toggleShowCmt] = useToggle(false);
    const [comment, setComment] = useState("");
    const [cmtErr, setCmtErr] = useState(null);

    const { user } = useContext(AuthContext);
    const { error, document } = useCollection("blogs");
    const { error: userErr, document: userDoc } = useCollection("users");
    const { response, editDocument, deleteDocument } = useFirestore();
    const { error: updateErr, isPending, success } = response;

    const navigate = useNavigate();

    async function fetchSingleDocument(id) {
        const documentRef = doc(db, "blogs", id);
        try {
            const docSnapshot = await getDoc(documentRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                return data;
            } else {
                console.log("Document not found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            setCmtErr(error.message);
        }
    }

    const handleInfo = async (cate, id) => {
        let items = [];
        if (!user) setCmtErr("You need to login first to " + cate);
        else {
            const data = await fetchSingleDocument(id);
            items = cate === "comment" ? data.comments : data.likes;

            const itemInfo =
                cate === "comment"
                    ? {
                          comment,
                          user: {
                              uid: user.uid,
                              name: user.displayName,
                              email: user.email,
                              photo: user.photoURL,
                          },
                      }
                    : {
                          user: {
                              uid: user.uid,

                              name: user.displayName,
                              email: user.email,
                              photo: user.photoURL,
                          },
                      };

            const updateInfo = cate === "comment" ? { comments: [itemInfo, ...items] } : { likes: [itemInfo, ...items] };

            await editDocument("blogs", updateInfo, id);
            setComment("");
        }
    };

    // handle remove likes
    const handleRemoveLike = async (id) => {
        const data = await fetchSingleDocument(id);
        const likes = data?.likes?.filter((like) => like?.user?.uid !== user?.uid);
        await editDocument("blogs", { likes }, id);
    };

    // delete blog
    const handleDelete = async (id) => {
        await deleteDocument("blogs", id);
        console.log("Successfully deleted the post");
    };

    useEffect(() => {
        if(updateErr || userErr || error || cmtErr) {
            window.scrollTo(0, 0)
        }
    }, [updateErr, userErr, error, cmtErr])

    return (
        <>
            {error && message("danger", error)}
            {userErr && message("danger", userErr)}
            {cmtErr && message("danger", cmtErr)}
            {updateErr && message("danger", updateErr)}

            <div className="Feed">
                <div className="container flex-col">
                    {document
                        ?.slice()
                        .reverse()
                        .map((blog) => (
                            <div className="blog flex-col">
                                <div className="user flex">
                                    <div className="img">
                                        <img
                                            src={
                                                userDoc?.filter((user) => user?.id === blog?.uid)[0].photoURL
                                                    ? userDoc?.filter((user) => user?.id === blog?.uid)[0].photoURL
                                                    : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="name">{blog.user.name}</div>
                                    {blog.uid === user?.uid && (
                                        <div class="dropdown">
                                            <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                More
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li onClick={() => navigate(`/blog/${blog?.id}/edit`, { state: blog })}>
                                                    <a class="dropdown-item" href="#">
                                                        Edit
                                                    </a>
                                                </li>
                                                <li onClick={() => handleDelete(blog?.id)}>
                                                    <a class="dropdown-item" href="#">
                                                        Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {blog?.imgUrl && (
                                    <div className="blog-img">
                                        <img src={blog?.imgUrl} alt="" />
                                    </div>
                                )}
                                <div className="title">{blog.title}</div>
                                <p className="blog-content">{blog.blog}</p>
                                <div className="other-info flex">
                                    <div className="left flex">
                                        <div className="like flex">
                                            {isPending ? (
                                                <div className="spinner button">
                                                    <div className="spinner-border text-dark" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : blog?.likes?.some((usr) => usr?.user?.uid === user?.uid) ? (
                                                <i class="fa-solid fa-heart" onClick={() => handleRemoveLike(blog?.id)}></i>
                                            ) : (
                                                <i class="fa-regular fa-heart" onClick={() => handleInfo("like", blog.id)}></i>
                                            )}
                                            <span>{blog?.likes?.length}</span>
                                        </div>
                                        <div className="comment flex" onClick={() => toggleShowCmt()}>
                                            {showCmt ? <i class="fa-solid fa-comment"></i> : <i class="fa-regular fa-comment"></i>}
                                            <span>{blog?.comments?.length}</span>
                                        </div>
                                    </div>
                                    <i class="fa-solid fa-caret-down" onClick={() => toggleShowCmt()} style={!showCmt ? { display: "flex" } : { display: "none" }}></i>
                                    <i class="fa-solid fa-caret-up" onClick={() => toggleShowCmt()} style={showCmt ? { display: "flex" } : { display: "none" }}></i>
                                </div>

                                {user && (
                                    <form
                                        className="cmt-field flex"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleInfo("comment", blog.id);
                                        }}>
                                        <textarea required name="comment" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add your comment"></textarea>
                                        {isPending ? (
                                            <div className="spinner button">
                                                <div className="spinner-border text-dark" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button style={{ border: "none", outline: "none" }}>
                                                <i type="submit" class="fa-regular fa-paper-plane"></i>
                                            </button>
                                        )}
                                    </form>
                                )}
                                {showCmt && (
                                    <div className="comments flex-col">
                                        {blog?.comments?.length === 0 ? (
                                            <h3 style={{ textAlign: "center" }}>NO COMMENTS YET</h3>
                                        ) : (
                                            blog?.comments?.map((comment) => (
                                                <div className="comment flex-col">
                                                    <div className="user flex">
                                                        <div className="img">
                                                            <img
                                                                src={
                                                                    userDoc?.filter((user) => user?.id === comment?.user?.uid)[0].photoURL
                                                                        ? userDoc?.filter((user) => user?.id === comment?.user?.uid)[0].photoURL
                                                                        : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="name" style={{ textTransform: "capitalize" }}>
                                                            {comment?.user?.name}
                                                        </div>
                                                    </div>
                                                    <div className="comment-msg">{comment?.comment}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
