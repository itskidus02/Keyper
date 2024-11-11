import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import { fetchVaults } from "./redux/vault/vaultSlice";
import Home from "./pages/public/Home";
import SignIn from "./pages/public/SignIn";
import SignUp from "./pages/public/SignUp";
import Profile from "./pages/private/Admin/Pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./pages/private/Admin/Components/Sidebar";
import PassGen from "./pages/private/Admin/Pages/PassGen";
import PassHealth from "./pages/private/Admin/Pages/PassHealth";
import VaultPage from "./pages/private/Admin/Pages/VaultPage";
import Dashboard from "./pages/private/Admin/Pages/Dashboard";

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); 
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Track previous user to detect actual sign-out
  const [previousUser, setPreviousUser] = useState(currentUser);

  // Update previousUser whenever currentUser changes
  useEffect(() => {
    setPreviousUser(currentUser);
  }, [currentUser]);

  // Fetch vaults whenever the user changes or page changes
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchVaults());
    }
  }, [dispatch, location, currentUser]);

  // Reload page on sign-out only
  useEffect(() => {
    if (previousUser && !currentUser) {
      window.location.reload();
    }
  }, [currentUser, previousUser]);

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          {/* Admin Routes */}
          <Route path="/admin" element={<Sidebar />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="passgen" element={<PassGen />} />
            <Route path="passhealth" element={<PassHealth />} />
            <Route path="vault/:vaultId" element={<VaultPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
