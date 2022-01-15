//* Library Imports
import { useEffect, useState, useCallback, useContext } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";

//* Internal Imports
import { auth, signIn, googleAuthProvider, firestore } from "../lib/firebase";
import { UserContext } from "../lib/context";

//* Third-party Imports
import { FcGoogle } from "react-icons/fc";
import debounce from "lodash.debounce";

//* Main Component
export default function Auth(props) {
  const { user, username } = useContext(UserContext);
  const [changeUsername, setChangeUsername] = useState(false);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <>
            <h3>
              Username:{" "}
              <span className="text-info" style={{ marginLeft: "1rem" }}>
                {username}
              </span>
            </h3>
            {changeUsername ? (
              <UsernameForm
                change={true}
                setChangeUsername={setChangeUsername}
              />
            ) : (
              <ChangeUserName setChangeUsername={setChangeUsername} />
            )}
            <SignOutButton />
          </>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//? Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signIn(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <div className="icon">
        <FcGoogle />
      </div>{" "}
      Sign in with Google
    </button>
  );
}

//? Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

//? Handle Username Form
function UsernameForm({ change, setChangeUsername }) {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    //? Create refs for both documents
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);

    //? Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    !change
      ? batch.set(userDoc, {
          username: formValue,
          photoURL: user.photoURL,
          displayName: user.displayName,
        })
      : batch.update(userDoc, {
          username: formValue,
        });
    batch.set(usernameDoc, { uid: user.uid });

    //? Deleting the old username from the collection as it's no longer occupied
    change && batch.delete(doc(firestore, "usernames", username));

    //? Committing all three changes
    await batch.commit();

    //? Hide the form
    change && setChangeUsername(false);
  };

  const onChange = (e) => {
    //? Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    // const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    //? Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      // setFormValue(val);
      setLoading(true);
      setIsValid(false);
    } else {
      setLoading(false);
      setIsValid(false);
    }
    setFormValue(val);
  };

  //? Check if username exists in database
  useEffect(() => {
    checkUsername(formValue);
  }, [checkUsername, formValue]);

  //? Hit the database for username match after each debounced change
  //! useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3 && re.test(username)) {
        const docRef = doc(firestore, "usernames", username);
        const docSnap = await getDoc(docRef);

        // console.log("Firestore read executed!");
        setIsValid(!docSnap.exists()); //? Set true if no username exists for current val, else false
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    (!username || change) && (
      <section>
        <h3>{change ? "Change" : "Choose"} Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="Enter Username"
            autoComplete="off"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
            re={re}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          <button className="btn-red" onClick={() => setChangeUsername(false)}>
            Cancel
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading, re }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (!re.test(username)) {
    return <p className="text-danger">Invalid Username!</p>;
  } else if (username && !isValid) {
    return (
      <p className="text-danger">That username is taken, try a new one!</p>
    );
  } else {
    return <p></p>;
  }
}

//? Change Username Button
function ChangeUserName({ setChangeUsername }) {
  return (
    <button onClick={() => setChangeUsername(true)}>Change Username</button>
  );
}
