import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css"; // ✅ global app styles (dark scrollbar, yellow focus, etc.)
import Footer from "./components/common/Footer";
import GoToTopButton from "./components/common/GoToTopButton";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./providers/AuthProvider";

// ⚠️ STEP 2 TEST: This line checks if your environment keys are working
console.log("TESTING BACKEND URL:", import.meta.env.VITE_BASE_URL);

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
      <GoToTopButton />
    </AuthProvider>
  );
}

export default App;
