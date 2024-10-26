import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";
import Profile from "./pages/private/Admin/Pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./pages/private/Admin/Components/Sidebar";
import PassGen from "./pages/private/Admin/Pages/PassGen";
import PassHealth from "./pages/private/Admin/Pages/PassHealth";
import VaultPage from "./pages/private/Admin/Pages/VaultPage";
import { FloatingDockDemo } from "./components/FloatingDockDemo";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <FloatingDockDemo />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          {/* Admin Routes */}
          <Route path="/admin" element={<Sidebar />}>
            <Route path="profile" element={<Profile />} />
            <Route path="passgen" element={<PassGen />} />
            <Route path="passhealth" element={<PassHealth />} />
            <Route path="vault/:vaultId" element={<VaultPage />} /> {/* Add VaultPage route */}

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
