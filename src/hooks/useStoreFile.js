import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/config";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useFirestore } from "./useFirestore";

export function useStoreFile() {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [url, setUrl] = useState([]);

    const { error: editErr, editDocument } = useFirestore();

    const uploadFile = async (path, fileObj) => {
        let URL;
        setError(null);
        setIsPending(true);

        try {
            let res = await uploadBytes(ref(storage, path), fileObj);
            URL = await getDownloadURL(ref(storage, path));
            setUrl([...url, URL]);

            // uploading user info
            await updateProfile(auth.currentUser, { ...auth.currentUser, photoURL: URL });
            await editDocument("users", { photoURL: URL }, auth?.currentUser?.uid);

            setIsPending(false);
            return URL;
        } catch (err) {
            console.log(err.message);
            setIsPending(false);
            setError(err.message);
        }
    };
    return { error, isPending, uploadFile, url };
}
