import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { removeToken, getRole, getUser } from '../utils/auth';

// Material UI Icons
import HomeIcon          from '@mui/icons-material/Home';
import TrendingUpIcon    from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon   from '@mui/icons-material/AttachMoney';
import DescriptionIcon   from '@mui/icons-material/Description';
import PeopleIcon        from '@mui/icons-material/People';
import BarChartIcon      from '@mui/icons-material/BarChart';
import CreditCardIcon    from '@mui/icons-material/CreditCard';
import LogoutIcon        from '@mui/icons-material/Logout';
import MenuIcon          from '@mui/icons-material/Menu';
import CloseIcon         from '@mui/icons-material/Close';

const Layout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = getRole();
  const user      = getUser();
  const isAdmin   = role === 'Admin';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  /* Link definitions */
  const userLinks = [
    { to: '/dashboard',            Icon: HomeIcon,          label: 'Dashboard' },
    { to: '/emi-planner',          Icon: CurrencyRupeeIcon, label: 'EMI Planner' },
    { to: '/investment-planner',   Icon: TrendingUpIcon,    label: 'Investments' },
    { to: '/transactions',         Icon: DescriptionIcon,   label: 'Transactions' },
    { to: '/investments/realtime', Icon: BarChartIcon,      label: 'Real-Time' },
    { to: '/loans/amortization',   Icon: CreditCardIcon,    label: 'Amortization' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', Icon: HomeIcon,   label: 'Admin Dashboard' },
    { to: '/admin/users',     Icon: PeopleIcon, label: 'Users' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  /* Single NavLink sub-component */
  const NavLink = ({ to, Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`nav-link ${active ? 'nav-link--active' : ''}`}
      >
        <Icon style={{ width: 18, height: 18 }} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="layout-shell">

      {/* ── Enhanced Navbar ── */}
      <nav className="modern-nav">
        <div className="modern-nav__container">

          {/* Logo - Extreme Left on Desktop, Center on Mobile */}
          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="modern-nav__logo">
            <div className="modern-nav__logo-icon">
              <img src="/assets/logo.png" alt="WalletWise" />
            </div>
            <span className="modern-nav__logo-text">WalletWise</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="modern-nav__links">
            {links.map((link) => (
              <NavLink key={link.to} {...link} />
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="modern-nav__right">
            <div className="modern-nav__user">
              <div className="modern-nav__user-avatar">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="modern-nav__user-email">{user?.email || 'User'}</span>
            </div>
            <button className="modern-nav__logout" onClick={handleLogout}>
              <LogoutIcon style={{ width: 18, height: 18 }} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="modern-nav__toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="modern-nav__mobile">
            <div className="modern-nav__mobile-links">
              {links.map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </div>
            <div className="modern-nav__mobile-footer">
              <div className="modern-nav__mobile-user">
                <div className="modern-nav__user-avatar">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="modern-nav__user-email">{user?.email || 'User'}</span>
              </div>
              <button
                className="modern-nav__logout modern-nav__logout--mobile"
                onClick={handleLogout}
              >
                <LogoutIcon style={{ width: 18, height: 18 }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Content ── */}
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;





// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import {
//   LogOut,
//   Home,
//   TrendingUp,
//   IndianRupee,
//   DollarSign,
//   FileText,
//   Users,
//   BarChart3,
//   CreditCard,
//   Menu,
//   X
// } from 'lucide-react';
// import { useState } from 'react';
// import { removeToken, getRole, getUser } from '../utils/auth';

// const Layout = () => {
//   const navigate = useNavigate();
//   const role = getRole();
//   const user = getUser();
//   const isAdmin = role === 'Admin';

//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleLogout = () => {
//     removeToken();
//     navigate('/login');
//   };

//   const NavLink = ({ to, icon: Icon, label }) => (
//     <Link
//       to={to}
//       onClick={() => setMobileOpen(false)}
//       className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
//         text-gray-600 hover:text-blue-600 hover:bg-white/70 transition-all"
//     >
//       <Icon size={18} className="group-hover:scale-110 transition" />
//       {label}
//     </Link>
//   );

//   return (
//     <div className="dashboard-bg">
//       {/* NAVBAR */}
//       <nav className="nav-glass shadow-lg">
//         <div className="w-full px-4 h-16 flex items-center">
          
//           {/* EXTREME LEFT LOGO */}
//           <Link
//             to={isAdmin ? '/admin/dashboard' : '/dashboard'}
//             className="flex items-center gap-2 mr-8"
//           >
//             <img
//               src="/assets/logo.png"
//               alt="WalletWise Logo"
//               className="w-32 h-auto"
//             />
//             <span className="text-xl font-bold text-gray-800 tracking-wide">
//               WalletWise
//             </span>
//           </Link>

//           {/* DESKTOP MENU */}
//           <div className="hidden md:flex items-center gap-1">
//             {!isAdmin ? (
//               <>
//                 <NavLink to="/dashboard" icon={Home} label="Dashboard" />
//                 <NavLink to="/emi-planner" icon={IndianRupee} label="EMI Planner" />
//                 <NavLink to="/investment-planner" icon={TrendingUp} label="Investments" />
//                 <NavLink to="/transactions" icon={FileText} label="Transactions" />
//                 <NavLink to="/investments/realtime" icon={BarChart3} label="Real-Time" />
//                 <NavLink to="/loans/amortization" icon={CreditCard} label="Amortization" />
//               </>
//             ) : (
//               <>
//                 <NavLink to="/admin/dashboard" icon={Home} label="Admin Dashboard" />
//                 <NavLink to="/admin/users" icon={Users} label="Users" />
//               </>
//             )}
//           </div>

//           {/* PUSH RIGHT */}
//           <div className="ml-auto hidden md:flex items-center gap-4">
//             <span className="text-sm text-gray-700 truncate max-w-[160px]">
//               {user?.email || 'User'}
//             </span>
//             <button
//               onClick={handleLogout}
//               className="btn-clay text-red-600 flex items-center gap-2 px-4"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>

//           {/* MOBILE TOGGLE */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="md:hidden ml-auto p-2 rounded-xl glass"
//           >
//             {mobileOpen ? <X /> : <Menu />}
//           </button>
//         </div>

//         {/* MOBILE MENU */}
//         {mobileOpen && (
//           <div className="md:hidden px-4 pb-4 pt-2 space-y-2 glass animate-slide-in">
//             {!isAdmin ? (
//               <>
//                 <NavLink to="/dashboard" icon={Home} label="Dashboard" />
//                 <NavLink to="/emi-planner" icon={DollarSign} label="EMI Planner" />
//                 <NavLink to="/investment-planner" icon={TrendingUp} label="Investments" />
//                 <NavLink to="/transactions" icon={FileText} label="Transactions" />
//                 <NavLink to="/investments/realtime" icon={BarChart3} label="Real-Time" />
//                 <NavLink to="/loans/amortization" icon={CreditCard} label="Amortization" />
//               </>
//             ) : (
//               <>
//                 <NavLink to="/admin/dashboard" icon={Home} label="Admin Dashboard" />
//                 <NavLink to="/admin/users" icon={Users} label="Users" />
//               </>
//             )}

//             <button
//               onClick={handleLogout}
//               className="w-full btn-clay text-red-600 flex items-center justify-center gap-2 mt-3"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         )}
//       </nav>

//       {/* CONTENT */}
//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;




// "use client";

// import { Outlet, Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "react-toastify";

// import {
//   Navbar,
//   NavBody,
//   NavItems,
//   MobileNav,
//   NavbarLogo,
//   NavbarButton,
//   MobileNavHeader,
//   MobileNavToggle,
//   MobileNavMenu,
// } from "./ui/resizable-navbar";


// import {
//   Home,
//   TrendingUp,
//   DollarSign,
//   FileText,
//   Users,
//   BarChart3,
//   CreditCard,
//   LogOut,
// } from "lucide-react";

// import { removeToken, getRole, getUser } from "../utils/auth";

// const Layout = () => {
//   const navigate = useNavigate();
//   const role = getRole();
//   const user = getUser();
//   const isAdmin = role === "Admin";

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     removeToken();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   /* ================= NAV ITEMS ================= */

//   const userNavItems = [
//     { name: "Dashboard", link: "/dashboard", icon: <Home size={18} /> },
//     { name: "EMI Planner", link: "/emi-planner", icon: <DollarSign size={18} /> },
//     { name: "Investments", link: "/investment-planner", icon: <TrendingUp size={18} /> },
//     { name: "Transactions", link: "/transactions", icon: <FileText size={18} /> },
//     { name: "Real-Time", link: "/investments/realtime", icon: <BarChart3 size={18} /> },
//     { name: "Amortization", link: "/loans/amortization", icon: <CreditCard size={18} /> },
//   ];

//   const adminNavItems = [
//     { name: "Admin Dashboard", link: "/admin/dashboard", icon: <Home size={18} /> },
//     { name: "Users", link: "/admin/users", icon: <Users size={18} /> },
//   ];

//   const navItems = isAdmin ? adminNavItems : userNavItems;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= NAVBAR ================= */}
//       <Navbar className="backdrop-blur-xl bg-white/70 border-b border-white/30 shadow-lg">
//         {/* -------- Desktop -------- */}
//         <NavBody>
//           <NavbarLogo>
//             <Link
//               to={isAdmin ? "/admin/dashboard" : "/dashboard"}
//               className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
//             >
//               WalletWise
//             </Link>
//           </NavbarLogo>

//           <NavItems
//             items={navItems.map((item) => ({
//               name: (
//                 <span className="flex items-center gap-2 text-base font-medium">
//                   {item.icon}
//                   {item.name}
//                 </span>
//               ),
//               link: item.link,
//             }))}
//             renderItem={(item) => (
//               <Link
//                 to={item.link}
//                 className="px-4 py-2 rounded-xl text-gray-700 hover:text-indigo-600
//                            hover:bg-white/80 transition-all"
//               >
//                 {item.name}
//               </Link>
//             )}
//           />

//           <div className="flex items-center gap-4">
//             <span className="hidden sm:block text-sm text-gray-600">
//               {user?.email}
//             </span>

//             <NavbarButton
//               variant="secondary"
//               onClick={handleLogout}
//               className="flex items-center gap-2"
//             >
//               <LogOut size={16} />
//               Logout
//             </NavbarButton>
//           </div>
//         </NavBody>

//         {/* -------- Mobile -------- */}
//         <MobileNav>
//           <MobileNavHeader>
//             <NavbarLogo>
//               <Link
//                 to={isAdmin ? "/admin/dashboard" : "/dashboard"}
//                 className="text-xl font-bold text-indigo-600"
//               >
//                 WalletWise
//               </Link>
//             </NavbarLogo>

//             <MobileNavToggle
//               isOpen={isMobileMenuOpen}
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             />
//           </MobileNavHeader>

//           <MobileNavMenu
//             isOpen={isMobileMenuOpen}
//             onClose={() => setIsMobileMenuOpen(false)}
//           >
//             {navItems.map((item, idx) => (
//               <Link
//                 key={idx}
//                 to={item.link}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="flex items-center gap-3 text-lg text-gray-700"
//               >
//                 {item.icon}
//                 {item.name}
//               </Link>
//             ))}

//             <div className="mt-6">
//               <NavbarButton
//                 variant="primary"
//                 className="w-full flex items-center justify-center gap-2"
//                 onClick={handleLogout}
//               >
//                 <LogOut size={18} />
//                 Logout
//               </NavbarButton>
//             </div>
//           </MobileNavMenu>
//         </MobileNav>
//       </Navbar>

//       {/* ================= CONTENT ================= */}
//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;
