
import './App.css';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import SeatBookingPage from './pages/SeatBookingPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import ProfilePage from './pages/ProfilePage';
import FinalizePayment from './pages/FinalizePayment';
import ResetForm from './components/ResetForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import Chatbot from './pages/Chatbot';
import LeaderboardPage from './pages/Leaderboardpage';

function App() {
  return (
    <Routes>
       <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/reset-password" element={<ResetForm/>}/>

      <Route path="/booking" element={<BookingPage />} />
      <Route path="/seats" element={<SeatBookingPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/finalize-payment" element={<FinalizePayment/>}/>
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/chatbot" element={<Chatbot />} />

      <Route path="/leaderboard" element={<LeaderboardPage />} />

    </Routes>
  );
}

export default App;
