import Lottie from "lottie-react";
import { Link } from "react-router";
import notFound from "../assets/404.json";
import HeadTag from "../components/common/HeadTag";

const NotFound = () => {
  return (
    <>
      <HeadTag title="Creators Hub Academy | Page Not Found" />
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="text-center">
          <div className="h-56 w-56 mx-auto">
            <Lottie animationData={notFound} loop={true} size={10} />
          </div>
          <p className="text-2xl mt-4 text-white">Page Not Found</p>
          <p className="mt-2 text-gray-400 text-lg">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;