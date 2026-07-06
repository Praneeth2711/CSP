import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  Briefcase, Award, GraduationCap, FileText, HelpCircle, 
  LayoutDashboard, MessageSquare, BookOpen, Sun, Moon, 
  Languages, LogOut, LogIn, Menu, X, Bell, User, Cpu
} from "lucide-react";
import { Button } from "@empowerrural/ui";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const activePath = location.pathname;

  const navItems = [
    { name: "Home", path: "/", icon: <BookOpen className="w-4.5 h-4.5" /> },
    { name: "Jobs", path: "/jobs", icon: <Briefcase className="w-4.5 h-4.5" /> },
    { name: "Schemes", path: "/schemes", icon: <Award className="w-4.5 h-4.5" /> },
    { name: "Skills", path: "/skills", icon: <GraduationCap className="w-4.5 h-4.5" /> },
    { name: "Career", path: "/career", icon: <Award className="w-4.5 h-4.5" /> },
    { name: "Resources", path: "/resources", icon: <BookOpen className="w-4.5 h-4.5" /> },
    { name: "AI Coach", path: "/ai", icon: <Cpu className="w-4.5 h-4.5" /> },
    ...(user ? [{ name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> }] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      
      {/* 1. TOP HEADER HEADER (DESKTOP) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800 glass dark:glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
              ER
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                {t("app.title")}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase -mt-1">
                Rural Career Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activePath === item.path
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Change Language"
            >
              <Languages className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
              </button>
              
              {/* Simple Mock Notification dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-700 mb-2">
                    <span className="font-semibold text-slate-800 dark:text-white">Notifications</span>
                    <button onClick={() => setNotifDropdownOpen(false)} className="text-[10px] text-emerald-600 font-medium">Mark Read</button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 border-l-2 border-emerald-500">
                      <p className="font-semibold text-[12px] text-slate-800 dark:text-white">Profile Updated Successfully</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your regional preferences have been updated.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <p className="font-semibold text-[12px] text-slate-800 dark:text-white">New Govt Scheme Available</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Eligibility rules matching Telangana states loaded.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2.5">
                {user.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                    Admin Panel
                  </Button>
                )}
                <button
                  onClick={logout}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("button.logout")}</span>
                </button>
              </div>
            ) : (
              <Button size="sm" variant="secondary" className="hidden md:inline-flex" onClick={() => login("ramesh@email.com")}>
                <LogIn className="w-4 h-4 mr-1.5" />
                {t("button.login")}
              </Button>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm top-16" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 inset-x-0 bg-white dark:bg-slate-850 p-4 border-b border-slate-100 dark:border-slate-700 space-y-2 shadow-lg" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-xl text-base font-semibold ${
                  activePath === item.path
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center space-x-3 p-3 w-full text-left text-rose-600 font-semibold rounded-xl hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("button.logout")}</span>
              </button>
            ) : (
              <button
                onClick={() => { login("demo@email.com"); setMobileMenuOpen(false); }}
                className="flex items-center space-x-3 p-3 w-full text-left text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50"
              >
                <LogIn className="w-5 h-5" />
                <span>{t("button.login")}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. MAIN LAYOUT WORKSPACE */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
        {children}
      </main>

      {/* 3. FOOTER */}
      <footer className="hidden lg:block border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p>© 2026 {t("footer.rights")}</p>
          <div className="flex space-x-4 mt-2 sm:mt-0 font-medium">
            <Link to="/literacy" className="hover:text-emerald-600 transition-colors">Help Center</Link>
            <Link to="/about" className="hover:text-emerald-600 transition-colors">Gram Panchayat Registry</Link>
            <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>

      {/* 4. MOBILE BOTTOM NAVIGATION MENU */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-850 border-t border-slate-100 dark:border-slate-850/80 px-2 py-2 flex justify-around items-center shadow-lg pb-safe">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 ${
            activePath === "/" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>
        <Link
          to="/jobs"
          className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 ${
            activePath === "/jobs" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Jobs</span>
        </Link>
        <Link
          to="/schemes"
          className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 ${
            activePath === "/schemes" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Award className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Schemes</span>
        </Link>
        <Link
          to="/dashboard"
          className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 ${
            activePath === "/dashboard" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </Link>
        <Link
          to="/ai"
          className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 ${
            activePath === "/ai" ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Cpu className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[10px] mt-0.5">AI Coach</span>
        </Link>
      </div>

    </div>
  );
};
