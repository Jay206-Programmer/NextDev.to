import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster/>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
