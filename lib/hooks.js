import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore } from "./firebase";

//? Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  //? Listens to user change, Handles sign-in & sign-out
  useEffect(() => {
    //? to turn off realtime subscription
    let unsubscribe;

    if (user) {
      //? Listening Live for username change
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        console.log(doc.data());
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
