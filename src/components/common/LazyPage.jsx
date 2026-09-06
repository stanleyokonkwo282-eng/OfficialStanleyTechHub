import { Suspense } from "react";
import LoaderDotted from "./LoaderDotted";

function LazyPage({ children }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderDotted />
      </div>
    }>
      {children}
    </Suspense>
  );
}

export default LazyPage;
