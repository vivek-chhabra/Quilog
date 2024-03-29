import { signOut, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/config";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { doc, setDoc } from "firebase/firestore";

export function useLogin(email, password) {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    // consuming auth context
    const { dispatch, user } = useContext(AuthContext);

    // login with email and password
    const login = async () => {
        setIsPending(true);
        setError(null);

        // logging in the user
        try {
            let res = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged In Successfully");

            // changing the user collection at db as user logs in
            const colRef = doc(db, "users", `${auth.currentUser.uid}`); // collection ref
            await setDoc(colRef, { name: auth.currentUser.displayName, photoURL: auth.currentUser.photoURL, online: true, email: auth?.currentUser?.email, number: auth?.currentUser?.phoneNumber });

            // dispatch login action
            dispatch({ type: "LOGIN", payLoad: res.user });

            // won't run if the corresponding component gets unmounted
            if (!isCancelled) {
                setIsPending(false);
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    };

    // login with google
    const googleLogin = async () => {
        setIsPending(true);
        setError(null);

        try {
            let res = await signInWithPopup(auth, googleProvider);
            console.log("Logged In With Google Successfully");

            // dispatch login action
            dispatch({ type: "LOGIN", payLoad: res.user });

            if (!isCancelled) {
                setIsPending(false);
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    };

    // useEffect(() => {
    //     // when component gets unmounted
    //     // return () => setIsCancelled(true);
    // }, []);

    return { error, isPending, login, googleLogin };
}