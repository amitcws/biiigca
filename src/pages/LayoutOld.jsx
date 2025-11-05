

import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Star, 
  BarChart3, 
  Shield,
  Menu,
  X,
  Home as HomeIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const navigationItems = [
    { name: "Home", url: createPageUrl(""), icon: HomeIcon },
    { name: "Explore", url: createPageUrl("Directory"), icon: Search },
    { name: "Compare", url: createPageUrl("Compare"), icon: BarChart3 },
    { name: "Watchlist", url: createPageUrl("Watchlist"), icon: Star },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <style>{`
        :root {
          --primary-50: #fff7ed;
          --primary-100: #ffedd5;
          --primary-500: #ef6c00;
          --primary-600: #d66000;
          --primary-700: #c2410c;
          --accent-gold: #d4af37;
          --accent-rose: #fb7185;
        }
        
        .nav-blur {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .glow-effect {
          box-shadow: 0 0 30px rgba(239, 108, 0, 0.15);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-3 nav-blur bg-white/80 shadow-lg' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo - BiiiG with tagline */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ef6c00] to-rose-600 bg-clip-text text-transparent">
                  BiiiG
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block leading-tight">
                  Big Impact Innovative
                  <br />
                  Initiatives for Good
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? 'bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/50 hover:text-[#ef6c00]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to={createPageUrl("AdminDashboard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === createPageUrl("AdminDashboard")
                      ? 'bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/50 hover:text-[#ef6c00]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ef6c00] to-rose-500 flex items-center justify-center text-white font-semibold">
                        {user.full_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="font-medium">{user.full_name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => base44.auth.logout()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white hover:shadow-lg transition-shadow"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 rounded-2xl bg-white/90 nav-blur shadow-xl space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.url
                      ? 'bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to={createPageUrl("AdminDashboard")}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === createPageUrl("AdminDashboard")
                      ? 'bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              <div className="pt-2 border-t">
                {user ? (
                  <Button 
                    onClick={() => base44.auth.logout()}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button 
                    onClick={() => base44.auth.redirectToLogin()}
                    className="w-full bg-gradient-to-r from-[#ef6c00] to-rose-500 text-white"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Footer - Updated to BiiiG */}
      <footer className="mt-20 py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold">BiiiG.ca</span>
              </div>
              <p className="text-gray-400 text-sm">
                Big Impact Innovative Initiatives for Good — Track billionaires' wealth, industries, and impact on innovation and society.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to={createPageUrl("Home")} className="block hover:text-[#ef6c00] transition-colors">
                  Home
                </Link>
                <Link to={createPageUrl("Directory")} className="block hover:text-[#ef6c00] transition-colors">
                  Explore
                </Link>
                <Link to={createPageUrl("Compare")} className="block hover:text-[#ef6c00] transition-colors">
                  Compare
                </Link>
                <Link to={createPageUrl("Watchlist")} className="block hover:text-[#ef6c00] transition-colors">
                  Watchlist
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-gray-400">
                Data sources include public records, financial reports, and verified submissions. All figures are estimates.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} BiiiG.ca - Big Impact Innovative Initiatives for Good. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}