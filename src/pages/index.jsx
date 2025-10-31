import Layout from "./Layout.jsx";

import Directory from "./Directory";

import Profile from "./Profile";

import Watchlist from "./Watchlist";

import Compare from "./Compare";

import AdminDashboard from "./AdminDashboard";

import Home from "./Home";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Directory: Directory,
    
    Profile: Profile,
    
    Watchlist: Watchlist,
    
    Compare: Compare,
    
    AdminDashboard: AdminDashboard,
    
    Home: Home,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Directory />} />
                
                
                <Route path="/Directory" element={<Directory />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Watchlist" element={<Watchlist />} />
                
                <Route path="/Compare" element={<Compare />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Home" element={<Home />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}