//* Importing CSS
import "../styles/globals.css";

//* Global Components
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";

//* Third-party Libraries
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
        <Toaster />
        <Navbar />
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
