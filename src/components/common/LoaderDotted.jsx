export default function LoaderDotted() {
  return (
    <div className="flex justify-center items-center h-screen" role="status" aria-label="Loading content">
      <span className="loading loading-dots loading-xl"></span>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
