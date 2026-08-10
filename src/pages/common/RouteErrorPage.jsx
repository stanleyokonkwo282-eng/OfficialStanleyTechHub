import { useRouteError } from "react-router";
import { Link } from "react-router";
import { FiAlertTriangle } from "react-icons/fi";
import HeadTag from "../../components/common/HeadTag";

const RouteErrorPage = () => {
  const error = useRouteError();
  console.error("Route Error Boundary caught an exception:", error);

  return (
    <>
      <HeadTag title="Creators Hub Academy | Unexpected Error" />
      <div className="min-h-screen flex items-center justify-center bg-black px-6 text-white">
        <div className="text-center max-w-md w-full p-8 border border-neutral-800 bg-neutral-950 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-400/10 rounded-full text-yellow-400">
              <FiAlertTriangle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            An unexpected application error has occurred. Our team has been notified.
          </p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
            <p className="text-xs font-semibold text-red-400 mb-1">Error Diagnostics:</p>
            <p className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
              {error?.message || error?.statusText || String(error || "Unknown Error")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition cursor-pointer text-center"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg shadow hover:bg-neutral-700 transition text-center"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteErrorPage;
