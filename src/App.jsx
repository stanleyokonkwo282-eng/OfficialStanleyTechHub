import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import Footer from "./components/common/Footer";
import GoToTopButton from "./components/common/GoToTopButton";
import Navbar from "./components/common/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./providers/AuthProvider";
import { NotificationProvider } from "./providers/NotificationContext";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <Outlet />
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
          <GoToTopButton />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

