// import Head from "next/head";
// import Image from "next/image";
import Link from "next/link";

//* Third-Party Libraries
import toast from "react-hot-toast";

//* Importing Components
import Loader from "../components/Loader";

export default function Home() {
  return (
    <div>
      {/* <Loader show /> */}
      <button onClick={() => toast.success("Success!")}>click me</button>
    </div>
  );
}
