import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import { fetchVaults } from "./redux/vault/vaultSlice";
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

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [previousUser, setPreviousUser] = useState(currentUser);

  useEffect(() => {
    setPreviousUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    const clearAllBrowserData = async () => {
      if (currentUser) {
        try {
          // Call signout endpoint
          await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include'
          });

          // Clear cookies by setting expired date
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          }

          // Clear all storage
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear IndexedDB
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          });

          // Clear cache if supported
          if ('caches' in window) {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map(key => caches.delete(key)));
          }
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };

    // Handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentUser) {
        clearAllBrowserData();
      }
    };

    // Handle tab/window close
    const handleTabClose = (event) => {
      if (currentUser) {
        clearAllBrowserData();
        
        // Modern browsers might need this for mobile
        event.preventDefault();
        event.returnValue = '';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('unload', handleTabClose);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('unload', handleTabClose);
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchVaults());
    }
  }, [dispatch, location, currentUser]);

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
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Sidebar />}>
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