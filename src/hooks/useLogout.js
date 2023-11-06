import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { doc, setDoc } from "firebase/firestore";
import { useCollection } from "./useCollection";
import { db } from "../firebase/config";

export function useLogout() {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const [isCancelled, setIsCancelled] = useState(false);

    // auth context
    const { user } = useContext(AuthContext);
    const auth = getAuth();

    // useCollection hook
    const { document } = useCollection("users");

    const logout = async () => {
        setError(null);
        setIsPending(true);

        // sign the user out
        try {
            // changes at user collection if user logs out
            const colRef = doc(db, "users", `${user.uid}`); // collection ref
            await setDoc(colRef, { name: user.displayName, photoURL: user.photoURL, online: false, email: auth.currentUser.email, number: auth.currentUser.phoneNumber });

            // logging out the user
            await signOut(auth);

            // // dispatch logout action
            // dispatch({ type: "LOGOUT" });

            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // The user is logged out
                    dispatch({ type: "LOGOUT" });
                } else {
                    console.log("User Is Not Logged Out Yet");
                }

                if (!isCancelled) {
                    setIsPending(false);
                }
            });

            if (!auth?.currentUser?.uid) {
                console.log("User Is Not Logged In");
            }

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
    //     return () => setIsCancelled(true);
    // }, []);

    return { error, isPending, logout };
}
