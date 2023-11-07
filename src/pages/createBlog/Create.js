import React, { useContext, useState } from "react";
import "./Create.scss";
import { useFirestore } from "../../hooks/useFirestore";
import { message } from "../../utils/message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Select from "react-select";
import { categories } from "../../utils/categories";

export default function Create() {
    const { id } = useParams();
    const location = useLocation();
    const { state } = location;

    const [blog, setBlog] = useState(state ? state?.blog : "");
    const [title, setTitle] = useState(state ? state?.title : "");
    const [imgUrl, setImgUrl] = useState(state ? state?.imgUrl : "");
    const [selectedCate, setSelectedCate] = useState(state ? state?.category : "");

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // useFirestore hook
    const { addDocument, response, editDocument } = useFirestore();
    const { error, isPending, document, success } = response;

    // blog object
    const blogObj = id
        ? {
              title,
              imgUrl,
              blog,
              category: selectedCate,
          }
        : {
              title,
              imgUrl,
              blog,
              category: selectedCate,
              user: {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  photo: user.photoURL,
              },
              likes: [],
              comments: [],
          };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addDocument("blogs", blogObj);
        navigate("/read");
    };

    const handleUpdate = async (id) => {
        await editDocument("blogs", blogObj, id);
        navigate("/read");
    };

    return (
        <>
            {id && success && state && message("success", "Successfully updated the document")}
            {error && message("danger", error)}
            <div className="Create">
                <div className="container">
                    <form
                        action="/"
                        onSubmit={
                            id
                                ? (e) => {
                                      e.preventDefault();
                                      handleUpdate(id);
                                  }
                                : handleSubmit
                        }
                        className="flex-col">
                        <h1>
                            Start Your <span>Blog</span> Journey with Quilog!
                        </h1>
                        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" className="title" id="" />
                        <Select defaultValue={state ? state?.category : { value: "all", label: "All" }} isMulti className="select" styles={{ control: (p, state) => ({ ...p, border: "none", outline: "hidden", borderRadius: ".8rem" }) }} options={categories} onChange={(options) => setSelectedCate(options)} required placeholder={"Select Category"} />
                        <input type="text" name="img-url" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="img-url" id="" placeholder="Image Url" />
                        <textarea required name="blog" value={blog} onChange={(e) => setBlog(e.target.value)} id="create" cols="30" rows="10" placeholder="Blog"></textarea>
                        {isPending ? (
                            <div className="button">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <button type="submit">Submit</button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
