/* eslint-disable @next/next/no-img-element */

//* Library Imports
import Link from "next/link";
import { useContext } from "react";

//* Internal Imports
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const signOut = () => {
    auth.signOut();
    router.reload();
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`} passHref>
                {/* {console.log(user?user.photoURL:null)} */}
                <img src={user?.photoURL || "/hacker.png"} alt="image" />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter" passHref>
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
