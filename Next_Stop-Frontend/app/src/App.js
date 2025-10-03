
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

    </Routes>
  );
}

export default App;
