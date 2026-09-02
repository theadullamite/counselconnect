import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Counsellors from "./pages/Counsellors";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import CounsellorProfile from "./pages/CounsellorProfile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookingConfirmation from "./pages/BookingConfirmation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import RoleRoute from "./components/RoleRoute";


function App() {
  
  return (
    <BrowserRouter>
    <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/counsellors" element={<Counsellors />} />
        <Route path="/counsellors/:id" element={<CounsellorProfile />} />
        <Route path="/counsellors/:id/book" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client-dashboard" element={<RoleRoute allowedRole="client"><ClientDashboard /></RoleRoute>} />
        <Route path="/counsellor-dashboard" element={<RoleRoute allowedRole="counsellor"><CounsellorDashboard /></RoleRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
