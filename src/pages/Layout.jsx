

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
    { name: "Home", url: createPageUrl(""), icon: HomeIcon, img: "home_icon_menu.png" },
    { name: "Explore", url: createPageUrl("Directory"), icon: Search, faIcon: "fas fa-search" },
    { name: "Compare", url: createPageUrl("Compare"), icon: BarChart3, img: "compare_chart_menu.png" },
    { name: "Watchlist", url: createPageUrl("Watchlist"), icon: Star, img: "star_menu.png" },
  ];

  const isAdmin = user?.role === 'admin';
  const teamMembers = [
    { name: "Amit Shukla", role: "CIO", img: "team/amit.webp" },
    { name: "Anuoluwapo S", role: "Partner Support & Onboarding", img: "team/demo_profile.png" },
    { name: "Jisun Ahmad", role: "Domain Mgmt", img: "team/jisun.jpeg" },
    { name: "Mohammad Ali", role: "HTML CSS", img: "team/ali.jpeg" },
    { name: "Mousumi Akter", role: "Executive Assistant", img: "team/mousumi.webp" },
    { name: "Reem Yaseen", role: "Graphic Design", img: "team/reem.webp" },
    { name: "Rishav Garg", role: "CFO", img: "team/demo_profile.png" },
    { name: "ROiiiY Patterson", role: "Engagement & Growth", img: "team/roi.webp" },
    { name: "Tesfamichael G.", role: "UX UI Design", img: "team/tesfa.webp" },
  ];

  // Check if current path is "/" or "/home"
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <>
      <div className="min-h-screen bg-backgroundColorLight font-myriad">
        {/* Custom Tailwind Config & Font */}
        <style jsx>{`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

          @font-face {
            font-family: 'Myriad Pro';
            src: url('/fonts/Myriad Pro Regular.ttf') format('truetype');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'Myriad Pro';
            src: url('/fonts/Myriad Pro Bold.ttf') format('truetype');
            font-weight: 700;
            font-style: normal;
          }

          :root {
            --secondary: #ef6c00;
            --textColor: #000000;
            --backgroundColorLight: #fffaf5;
            --backgroundColorDeep: #ffe8cf;
          }

          .bg-orangePurple {
            background: linear-gradient(135deg, #ef6c00 0%, #e91e63 100%);
          }

          .nav-item:hover {
            background-color: white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }

          .nav-item.active,
          .nav-item:active {
            background: linear-gradient(135deg, #ef6c00 0%, #e91e63 100%);
            color: white;
          }

          .nav-item.active i,
          .nav-item:active i,
          .nav-item.active img,
          .nav-item:active img {
            color: white;
            filter: brightness(0) invert(1);
          }
          .bg-secondary {
            --tw-bg-opacity: 1;
            background-color: rgb(239 108 0 / var(--tw-bg-opacity, 1));
          }
          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        `}</style>

        {/* Header */}
        <header
          id="header"
          className={`sticky top-0 z-50 transition-shadow duration-300 border-b border-gray-200 ${
            isScrolled ? "shadow-md" : ""
          } bg-backgroundColorLight`}
        >
          <div className="container mx-auto px-4 py-4">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between">
              {/* Logo */}
              <div className="w-1/5">
                <Link
                  to={createPageUrl("")}
                  className="flex items-center justify-center gap-1 text-white bg-secondary w-1/2 px-1 py-1 rounded-lg"
                >
                  <img src="/images/home_icon.png" alt="Logo" className="h-6 w-6" />
                  <span className="text-2xl font-extrabold mb-[-2px]">BiiiG</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="w-3/5">
                <ul className="flex items-center justify-center space-x-8">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <>
                      <li key={item.name}>
                        <Link
                          to={item.url}
                          className={`nav-item flex justify-center items-center text-textColor px-4 py-2 rounded-lg transition-all duration-300 ${
                            isActive ? "active" : ""
                          }`}
                        >
                          {item.img ? (
                            <img
                              src={`/images/${item.img}`}
                              alt=""
                              className="h-4 w-4 mr-2 transition-colors duration-300 mb-[1px]"
                            />
                          ) : item.faIcon ? (
                            <i className={`${item.faIcon} w-4 h-4 mr-2 transition-colors duration-300 text-center`}></i>
                          ) : (
                            <item.icon className="w-4 h-4 mr-2" />
                          )}
                          <span className="text-lg font-medium">{item.name}</span>
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
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
                      </li>
                      )}
                      </>
                    );
                  })}
                </ul>
              </nav>

              {/* Sign In */}
              <div className="w-1/5 flex justify-end">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium">{user.full_name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => base44.auth.logout()}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => base44.auth.redirectToLogin()}
                    className="bg-orangePurple text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-300"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex lg:hidden items-center justify-between">
              {/* Logo */}
              <Link
                to={createPageUrl("")}
                className="flex items-center justify-center gap-1 text-white bg-secondary px-3 py-1 rounded-lg"
              >
                <img src="/images/home_icon.png" alt="Logo" className="h-6 w-6" />
                <span className="text-2xl font-extrabold mb-[-2px]">BiiiG</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-textColor focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-8 h-8" />
                ) : (
                  <Menu className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 pb-4">
                <nav>
                  <ul className="flex flex-col space-y-4">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.url}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`nav-item flex items-center text-textColor px-4 py-2 rounded-lg transition-all duration-300 ${
                              isActive ? "active" : ""
                            }`}
                          >
                            {item.img ? (
                              <img
                                src={`/images/${item.img}`}
                                alt=""
                                className="h-4 w-4 mr-2 transition-colors duration-300 mb-[1px]"
                              />
                            ) : item.faIcon ? (
                              <i className={`${item.faIcon} w-4 h-4 mr-2 transition-colors duration-300 text-center`}></i>
                            ) : (
                              <item.icon className="w-4 h-4 mr-2" />
                            )}
                            <span className="text-lg font-medium">{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                    <li className="pt-4 border-t border-gray-200">
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
                          className="bg-orangePurple hover:opacity-90 text-white font-bold px-6 py-2 rounded-lg transition-opacity"
                        >
                          Sign In
                        </Button>
                      )}
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className={isHomePage ? "bg-gray-50 min-h-screen" : "pt-24"}>
          {children}
        </main>

        {/* Footer - Updated to BiiiG */}
        <footer className="bg-footerBackgroundColor text-gray-300 py-12">
        <div className="container mx-auto px-4">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Column 1: Quick Links */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={createPageUrl("")}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Directory")}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Compare")}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Compare
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Watchlist")}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Watchlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: About */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">About</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Data sources include public records, financial reports, <br />
                and verified submissions. All figures are estimates.
              </p>
            </div>

            {/* Column 3: Team */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Our Team</h3>
              <div className="flex flex-wrap gap-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="w-6/12 md:w-4/12 flex items-center gap-2"
                  >
                    <img
                      src={`/images/${member.img}`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">{member.name}</span>
                      <span className="text-gray-300 text-xs">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom - Copyright */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} BiiiG.ca - Big Impact Innovative Initiatives for Good. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

