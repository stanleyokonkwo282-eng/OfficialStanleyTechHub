export default function LoaderSpinner() {
  return (
    <div className="flex justify-center items-center h-full" role="status" aria-label="Loading content">
      <span className="loading loading-spinner loading-xl"></span>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
