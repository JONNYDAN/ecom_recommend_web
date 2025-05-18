import React, { useEffect, useMemo, useState } from "react";
import { Navbar, Nav, Avatar, Drawer, Sidenav, Loader, Message } from "rsuite";
import {
  MdOutlineHome,
  MdCategory,
  MdPhone,
  MdInfo,
  MdWorkOutline,
  MdArticle,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useScreenSize } from "@/contexts/ScreenSizeContext";
import useToggle from "@/hooks/useToggle";
import { getAvatarCharacter } from "@/utils/stringUtils";
import { logout } from "@/redux/auth/authThunk";
import MenuIcon from "@rsuite/icons/Menu";
import NavLink from "./NavLink";
import LanguageSwitch from "./LanguageSwitch";
import { localeItems } from "@/config/localeConfig";
import { categoryService } from '@/services/categoryService';

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'navigation_categories_cache';

// Helper function to generate consistent slugs
const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

function NavigationBar() {
  const { t: tCommon } = useTranslation(localeItems.common);
  const { t: tHeader } = useTranslation(localeItems.header);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add scroll tracking state
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch categories from API with caching
  useEffect(() => {
    const fetchCategoriesWithCache = async () => {
      // Check for cached data first
      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          
          // Check if cache is still valid (not expired)
          if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
            console.log('Using cached categories');
            setCategories(data);
            return;
          }
        } catch (err) {
          console.error('Error parsing cached categories:', err);
          // Continue with API fetch if cache parsing fails
        }
      }
      
      // Fetch from API if no valid cache exists
      setIsLoading(true);
      try {
        const result = await categoryService.getAllCategories();
        
        if (result.success) {
          // Cache the results with timestamp
          localStorage.setItem(
            CACHE_KEY, 
            JSON.stringify({
              data: result.data,
              timestamp: Date.now()
            })
          );
          
          setCategories(result.data);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        setError('Error fetching categories: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesWithCache();
  }, []);

  // Create navigation items with dynamic categories and proper slugs
  const navItems = useMemo(() => [
    {
      label: 'Trang chủ',
      path: "/",
      icon: <MdOutlineHome />,
    },
    {
      label: 'Sản phẩm',
      path: "/products?category=all",
      prominent: true,
      isDropdown: true,
      icon: <MdCategory />,
      children: isLoading ? [{ label: 'Loading...', path: '#' }] : 
        categories.map(category => {
          // Generate a consistent slug for the category
          const categorySlug = category.slug || generateSlug(category.name);
          
          return {
            label: category.name,
            path: `/products?category=${categorySlug}`,
            id: category._id, // Store the ID for reference
            hasSubMenu: category.subCategories && category.subCategories.length > 0,
            children: category.subCategories && category.subCategories.length > 0 ? 
              category.subCategories.map(subCategory => {
                // Generate a consistent slug for the subcategory
                const subCategorySlug = subCategory.slug || generateSlug(subCategory.name);
                
                // Simplified URL structure - only using category parameter
                return {
                  label: subCategory.name,
                  id: subCategory._id, 
                  path: `/products?category=${subCategorySlug}`,
                };
              }) : []
          };
        })
    },
    {
      label: 'Liên hệ',
      path: "/contact",
      prominent: true,
      icon: <MdPhone />,
    },
    {
      label: 'Tin tức',
      path: "/posts?category=news",
      prominent: true,
      icon: <MdArticle />,
    },
    {
      label: 'Giới thiệu',
      path: "/about-us",
      prominent: true,
      icon: <MdInfo />,
    },
    {
      label: 'Tuyển dụng',
      path: "/posts?category=career",
      prominent: true,
      icon: <MdWorkOutline />,
    },
  ], [categories, isLoading]);

  const [pageLoaded, setPageLoaded] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [showMobileMenu, toggleShowMobileMenu] = useToggle(false);

  const screenSize = useScreenSize();

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = router.pathname;

  const profileElement = useMemo(() => {
    return isLoggedIn && user ? (
      <div className="pe-0">
        <Avatar size="sm" className="me-2" style={{ background: "#111" }}>
          {getAvatarCharacter(user.name)}
        </Avatar>
        <span className="d-none d-md-inline-block">{user.name}</span>
      </div>
    ) : null;
  }, [isLoggedIn, user]);

  const renderNavItems = (showIcon) => {
    // Create a function to handle both dropdown toggling and navigation
    const handleMenuHeaderClick = (path) => {
      // Ensure navigation happens immediately
      if (path && path !== '#') {
        router.push(path);
      }
    };

    return (
      <>
        <Nav activeKey={pathname} className="navigation-items">
          {navItems.map((item, index) => {
            if (item.isDropdown) {
              // Show loading indicator while categories are being fetched
              if (isLoading && item.label === 'Sản phẩm') {
                return (
                  <Nav.Menu 
                    key={index} 
                    title={
                      <div className="nav-menu-title">
                        {item.label} <Loader size="xs" style={{ marginLeft: 10 }} />
                      </div>
                    } 
                    icon={(showIcon || item.prominent) && item.icon}
                    className={`nav-position-${index} hover-dropdown`}
                  >
                    <Nav.Item>Loading categories...</Nav.Item>
                  </Nav.Menu>
                );
              }
              
              return (
                <Nav.Menu 
                  key={index} 
                  title={
                    <div 
                      className="nav-menu-title" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuHeaderClick(item.path);
                      }}
                    >
                      {item.label}
                    </div>
                  } 
                  icon={(showIcon || item.prominent) && item.icon}
                  className={`nav-position-${index} hover-dropdown`}
                >
                  {item.children.map((child, childIndex) => {
                    if (child.hasSubMenu) {
                      return (
                        <Nav.Menu 
                          key={`${index}-${childIndex}`} 
                          title={
                            <div 
                              className="nav-menu-title" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuHeaderClick(child.path);
                              }}
                            >
                              {child.label}
                            </div>
                          }
                          placement="right"
                          className="hover-submenu"
                        >
                          {child.children.map((subChild, subChildIndex) => (
                            <Nav.Item 
                              key={`${index}-${childIndex}-${subChildIndex}`}
                              as={NavLink} 
                              href={subChild.path}
                              onClick={() => isMobile && toggleShowMobileMenu()}
                            >
                              {subChild.label}
                            </Nav.Item>
                          ))}
                        </Nav.Menu>
                      );
                    } else {
                      return (
                        <Nav.Item 
                          key={`${index}-${childIndex}`}
                          as={NavLink} 
                          href={child.path}
                          onClick={() => isMobile && toggleShowMobileMenu()}
                        >
                          {child.label}
                        </Nav.Item>
                      );
                    }
                  })}
                </Nav.Menu>
              );
            } else {
              return (
                <Nav.Item
                  key={index}
                  as={NavLink}
                  href={item.path}
                  eventKey={item.path}
                  icon={(showIcon || item.prominent) && item.icon}
                  onClick={() => isMobile && toggleShowMobileMenu()}
                  className={`nav-position-${index}`}
                >
                  {item.label}
                </Nav.Item>
              );
            }
          })}
        </Nav>
      </>
    );
  };

  const renderMobileDrawer = () => {
    return (
      <Drawer
        open={showMobileMenu}
        onClose={toggleShowMobileMenu}
        size="xs"
        className="navigation-drawer-container d-block d-sm-none"
        backdropClassName="navigation-drawer-backdrop"
        placement="left"
      >
        <Drawer.Header className="drawer-header">
          <div className="drawer-header-content">
            <div className="drawer-logo">
              {/* Add your logo here if needed */}
              <h4>Menu</h4>
            </div>
            <button className="drawer-close-btn" onClick={toggleShowMobileMenu}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </Drawer.Header>
        <Drawer.Body className="bg-light navigation-drawer-body">
          <div className="mobile-navigation">
            <Sidenav defaultOpenKeys={["3", "4"]} appearance="subtle">
              <Sidenav.Body>{renderNavItems(true)}</Sidenav.Body>
            </Sidenav>
          </div>
          <div className="mobile-drawer-footer">
            <LanguageSwitch />
          </div>
        </Drawer.Body>
      </Drawer>
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const isMobile = screenSize.isSmallerThan.md;

  return (
    <div className={`d-none d-sm-block navigation-container ${scrolled ? 'scrolled' : ''}`}>
      {error && (
        <Message type="error" closable>
          {error}
        </Message>
      )}
      <Navbar className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container d-flex">
          <Nav className="d-inline d-lg-none d-sm-none">
            <Nav.Item onClick={toggleShowMobileMenu}>
              <MenuIcon style={{ top: "2px", position: "relative" }} />
            </Nav.Item>
          </Nav>
          {renderNavItems()}
        </div>
      </Navbar>
      
      {renderMobileDrawer()}

      <style jsx global>{`
        /* Sticky navbar styling */
        .navigation-container {
          position: sticky;
          top: 0;
          z-index: 1030;
          transition: all 0.3s ease;
        }
        
        /* Enhanced Navbar Styling with pastel colors */
        .navbar-custom {
          background: linear-gradient(to right, #fff8fa, #fef6fa) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          border-bottom: 1px solid rgba(255, 110, 180, 0.2);
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }
        
        /* Scrolled state styles */
        .navbar-scrolled {
          padding: 0.25rem 0;
          background: linear-gradient(to right, rgba(255, 250, 253, 0.95), rgba(254, 245, 250, 0.95)) !important;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }
        
        /* Navigation items styling */
        .rs-nav-item a, 
        .rs-dropdown-toggle {
          color: #555 !important;
          font-weight: 500;
          font-size: 1rem;
          padding: 12px 18px !important;
          letter-spacing: 0.3px;
          position: relative;
          transition: all 0.25s ease;
        }
        
        /* Hover effect for nav items with underline */
        .rs-nav-item a::after,
        .rs-dropdown-toggle::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 8px;
          left: 18px;
          background-color: #ff6eb4;
          transition: width 0.3s ease;
          border-radius: 10px;
        }
        
        .rs-nav-item:hover a::after,
        .rs-dropdown:hover .rs-dropdown-toggle::after {
          width: calc(100% - 36px);
        }
        
        .rs-nav-item:hover a, 
        .rs-dropdown:hover .rs-dropdown-toggle {
          color: #ff6eb4 !important;
          background-color: rgba(255, 110, 180, 0.06);
          border-radius: 4px;
          transform: translateY(-1px);
        }
        
        /* Active nav item styling */
        .rs-nav-item-active a {
          color: #ff6eb4 !important;
          font-weight: 600;
        }
        
        /* Active nav item indicator - bottom bar */
        .rs-nav-item-active a::after {
          width: calc(100% - 36px);
          height: 3px;
          background-color: #ff6eb4;
          border-radius: 3px 3px 0 0;
        }
        
        /* Dropdown menu styling */
        .rs-dropdown-menu {
          background-color: white;
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
          border: 1px solid rgba(255, 110, 180, 0.15);
          border-radius: 8px;
          padding: 8px 4px;
          animation: dropdownFade 0.2s ease-in-out;
        }
        
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .rs-dropdown-item {
          transition: all 0.2s ease;
          border-radius: 5px;
          margin: 2px 4px;
        }
        
        .rs-dropdown-item:hover {
          background-color: rgba(255, 110, 180, 0.08);
          transform: translateX(2px);
        }
        
        .rs-dropdown-item a {
          padding: 10px 16px !important;
          border-radius: 5px;
        }
        
        /* Mobile menu styling */
        .rs-sidenav {
          background: linear-gradient(to right, #fff8fa, #fef8fc);
        }
        
        .rs-sidenav .rs-nav-item a, 
        .rs-sidenav .rs-dropdown-toggle {
          border-radius: 6px;
          margin: 3px 0;
        }
        
        .rs-sidenav .rs-nav-item-active {
          background-color: rgba(255, 110, 180, 0.15);
        }
        
        /* Custom styling for submenu indicators */
        .rs-dropdown-item-submenu > .rs-dropdown-item-content::after {
          color: #ff6eb4;
        }
        
        /* Icon styling */
        .rs-nav-item-icon,
        .rs-dropdown-toggle-icon {
          color: #ff6eb4;
          margin-right: 8px;
          font-size: 1.1rem;
        }
        
        /* Drawer header styling */
        .drawer-header {
          background: linear-gradient(to right, #fff8fa, #fef6fa);
          border-bottom: 2px solid rgba(255, 110, 180, 0.2);
        }
        
        .drawer-logo h4 {
          color: #555;
          font-weight: 600;
        }

        /* Keep existing styles... */
        .rs-navbar {
          background: linear-gradient(to right, #ffffff, #f8f9fa) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          border-bottom: 1px solid rgba(46, 204, 113, 0.2);
        }
        
        /* Navigation items styling */
        .rs-nav-item a, 
        .rs-dropdown-toggle {
          color: #333 !important;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 15px 18px !important;
          letter-spacing: 0.3px;
          position: relative;
          transition: color 0.2s ease, background 0.2s ease;
        }
        
        /* Hover effect for nav items */
        .rs-nav-item:hover a, 
        .rs-dropdown:hover .rs-dropdown-toggle {
          color: #2ecc71 !important;
          background-color: rgba(46, 204, 113, 0.08);
          border-radius: 4px;
        }
        
        /* Active nav item styling */
        .rs-nav-item-active a {
          color: #2ecc71 !important;
          font-weight: 600;
        }
        
        /* Active nav item indicator - bottom bar */
        .rs-nav-item-active a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 18px;
          right: 18px;
          height: 3px;
          background-color: #2ecc71;
          border-radius: 3px 3px 0 0;
        }
        
        /* Dropdown menu styling */
        .rs-dropdown-menu {
          background-color: white;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 6px;
        }
        
        .rs-dropdown-item {
          transition: background 0.2s ease;
        }
        
        .rs-dropdown-item:hover {
          background-color: rgba(46, 204, 113, 0.08);
        }
        
        .rs-dropdown-item a {
          padding: 10px 16px !important;
        }
        
        /* Mobile menu styling */
        .rs-sidenav .rs-nav-item a, 
        .rs-sidenav .rs-dropdown-toggle {
          border-radius: 6px;
          margin: 2px 0;
        }
        
        .rs-sidenav .rs-nav-item-active {
          background-color: rgba(46, 204, 113, 0.15);
        }
        
        /* Custom styling for submenu indicators */
        .rs-dropdown-item-submenu > .rs-dropdown-item-content::after {
          color: #2ecc71;
        }
        
        /* Icon styling */
        .rs-nav-item-icon,
        .rs-dropdown-toggle-icon {
          color: #2ecc71;
          margin-right: 8px;
        }
        
        /* Enhance the container */
        .container.d-flex {
          padding: 0 15px;
        }
        
        /* Drawer header styling */
        .drawer-header {
          background-color: #f8f9fa;
          border-bottom: 2px solid rgba(46, 204, 113, 0.2);
        }
        
        .drawer-logo h4 {
          color: #333;
          font-weight: 600;
        }
        
        /* Keep existing order styles intact */
        .navigation-items {
          display: flex;
          flex-direction: row;
        }
        
        .nav-position-0 { order: 0; }
        .nav-position-1 { order: 1; }
        .nav-position-2 { order: 2; }
        .nav-position-3 { order: 3; }
        .nav-position-4 { order: 4; }
        .nav-position-5 { order: 5; }
        
        /* Keep other existing styles */
        .rs-nav-menu-active > .rs-dropdown-menu { 
          display: block;
        }
        
        .rs-dropdown-item.rs-dropdown-item-submenu:hover > .rs-dropdown-menu {
          display: block;
          left: 100%;
          top: 0;
        }
        
        .rs-dropdown-menu {
          min-width: 200px;
        }

        .rs-sidenav {
          height: auto;
        }
        
        .rs-sidenav .rs-dropdown-menu {
          position: static;
          float: none;
          display: block;
          padding-left: 20px;
        }
        
        .rs-nav-item a {
          display: block;
          padding: 8px 12px;
          text-decoration: none;
          color: #333;
        }
        
        /* Ensure flex ordering doesn't interfere with natural order */
        .navigation-items {
          display: flex;
          flex-direction: row;
        }
        
        /* Force order based on position in array */
        .nav-position-0 { order: 0; }
        .nav-position-1 { order: 1; }
        .nav-position-2 { order: 2; }
        .nav-position-3 { order: 3; }
        .nav-position-4 { order: 4; }
        .nav-position-5 { order: 5; }
        
        /* Fix for any root container issues */
        .container.d-flex {
          flex-direction: row;
          align-items: center;
        }
        
        /* Ensure navbar takes full width */
        .rs-navbar-nav {
          width: 100%;
        }

        /* Mobile drawer styles */
        .navigation-drawer-container {
          overflow: hidden;
        }
        
        .drawer-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .drawer-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .drawer-close-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          padding: 0.25rem 0.75rem;
          cursor: pointer;
        }
        
        .navigation-drawer-body {
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .mobile-navigation {
          flex: 1;
          overflow-y: auto;
        }
        
        .mobile-drawer-footer {
          padding: 1rem;
          border-top: 1px solid #e5e5e5;
        }
        
        .rs-sidenav-item {
          padding: 12px 20px;
          height: auto;
        }
        
        .rs-sidenav-item-icon {
          margin-right: 12px;
          font-size: 18px;
        }

        .rs-dropdown-toggle {
          cursor: pointer;
        }
        
        .rs-nav-item-submenu > .rs-dropdown-item-content {
          cursor: pointer;
        }

        /* Add styles for hover dropdown functionality */
        .hover-dropdown:hover > .rs-dropdown-menu {
          display: block !important;
          opacity: 1;
          visibility: visible;
          transition: opacity 0.15s ease-in;
        }
        
        .hover-submenu:hover > .rs-dropdown-menu {
          display: block !important;
          opacity: 1;
          visibility: visible;
          left: 100% !important;
          top: 0 !important;
        }
        
        /* Make menu title clickable */
        .nav-menu-title {
          cursor: pointer;
          width: 100%;
          padding: 0;
        }
        
        /* Override rsuite's click handling for submenus */
        .rs-dropdown-item.rs-dropdown-item-submenu > .rs-dropdown-item-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        /* Fix submenu arrow indicator */
        .rs-dropdown-item.rs-dropdown-item-submenu > .rs-dropdown-item-content::after {
          color: #2ecc71;
          margin-left: 8px;
          content: '›';
          font-size: 20px;
          font-weight: bold;
          line-height: 1;
        }

        /* Mobile specific styles for menu headers */
        .rs-sidenav .nav-menu-title {
          width: 100%;
          display: block;
        }

        /* Fix for any z-index issues with dropdowns */
        .rs-dropdown {
          position: relative;
          z-index: 1000;
        }
        
        .rs-dropdown-menu {
          z-index: 1010;
        }
        
        /* Ensure dropdown arrow appears correctly */
        .rs-dropdown-toggle::after {
          margin-left: 0.3em;
        }
        
        /* Fix submenu positioning */
        .rs-nav-menu-active > .rs-dropdown-menu { 
          display: block !important;
        }

        /* Fix dropdown positioning */
        .rs-dropdown-menu {
          min-width: 200px;
          margin-top: 0;
        }
        
        /* Position top-level dropdowns below parent items */
        .hover-dropdown > .rs-dropdown-menu {
          position: absolute;
          top: 100% !important;
          left: 0 !important;
        }
        
        /* Keep sub-menu dropdowns positioned to the right */
        .hover-submenu > .rs-dropdown-menu {
          position: absolute;
          left: 100% !important;
          top: 0 !important;
        }
        
        /* Add a small offset to prevent flicker on hover */
        .rs-dropdown-menu {
          padding-top: 5px;
        }
        
        /* Ensure dropdown arrows appear correctly */
        .rs-dropdown-toggle::after {
          margin-left: 0.3em;
          vertical-align: middle;
        }
        
        /* Fix for Sidenav dropdown positioning */
        .rs-sidenav .rs-dropdown-menu {
          position: static !important;
          float: none;
          display: block;
          padding-left: 20px;
          margin-top: 0;
          padding-top: 0;
        }
        
        /* Fix any z-index conflicts */
        .rs-navbar {
          z-index: 1000;
        }
        
        .rs-dropdown {
          position: relative;
          z-index: 1000;
        }
        
        .rs-dropdown-menu {
          z-index: 1010;
        }
        
        /* Ensure hover states work correctly */
        .hover-dropdown:hover > .rs-dropdown-menu {
          display: block !important;
          opacity: 1;
          visibility: visible;
        }
        
        /* Clean up any padding issues */
        .rs-dropdown-item-content {
          padding: 8px 12px;
        }

        /* Add styles for loader in dropdown */
        .rs-loader-xs {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default NavigationBar;
