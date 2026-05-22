import { Link } from "react-router";
import HeadTag from "../components/common/HeadTag";

const Unauthorized = () => {
  return (
    <>
      <HeadTag title="Creators Hub Academy | Unauthorized" />
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-zinc-950 border border-zinc-800 shadow-xl rounded-2xl p-10 max-w-md text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Unauthorized Access</h2>
          <p className="text-gray-400 mb-6">
            Sorry, you don't have permission to view this page.
          </p>
          <Link
            to="/"
            className="inline-block bg-yellow-400 text-black px-5 py-2 rounded-lg hover:bg-yellow-500 transition font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;