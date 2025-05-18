import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Header,
  Navbar,
  Nav,
  Grid,
  Row,
  Col,
  InputGroup,
  Input,
  Badge,
  Button,
  Dropdown,
  IconButton,
  Drawer,
  Sidenav,
  Avatar,
  Tag
} from 'rsuite';
import Image from "next/image";
import {
  MdSearch,
  MdShoppingCart,
  MdAccountCircle,
  MdMenu,
  MdOutlineHome,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdLogout,
  MdPerson
} from 'react-icons/md';
import LanguageSwitch from './LanguageSwitch';
import { useCart } from '@/contexts/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthState } from '@/redux/auth/authSlice';
import { removeToken, removeUser } from '@/utils/storageUtils';
import { getAvatarCharacter } from "@/utils/stringUtils";
import { logout } from "@/redux/auth/authThunk";
/**
 * Example responsive HeaderBar
 */
export default function HeaderBar() {
  const router = useRouter();
  const { cartItems, getCartCount } = useCart();
  const dispatch = useDispatch();

  // Get auth state from Redux instead of local state
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Navigation items
  const navItems = [
    {
      label: 'Trang chủ',
      path: "/",
      icon: <MdOutlineHome />,
    },
    {
      label: 'Sản phẩm',
      path: "/products",
      prominent: true,
      isDropdown: true,
      children: [
        {
          label: 'Labubu chính hãng',
          path: "/products/labubu",
        },
        {
          label: 'Babythree chính hãng',
          path: "/products/babythree",
        },
        {
          label: 'Vali',
          path: "/products/vali",
          hasSubMenu: true,
          children: [
            {
              label: 'Vali chính hãng 1',
              path: "/products/vali/vali-1",
            },
            {
              label: 'Vali chính hãng 2',
              path: "/products/vali/vali-2",
            },
            {
              label: 'Vali chính hãng 3',
              path: "/products/vali/vali-3",
            },
          ]
        },
        {
          label: 'Giày',
          path: "/products/giay",
          hasSubMenu: true,
          children: [
            {
              label: 'Giày chính hãng 1',
              path: "/products/giay/giay-1",
            },
            {
              label: 'Giày chính hãng 2',
              path: "/products/giay/giay-2",
            },
            {
              label: 'Giày chính hãng 3',
              path: "/products/giay/giay-3",
            },
          ]
        },
        {
          label: 'Balo',
          path: "/products/balo",
          hasSubMenu: true,
          children: [
            {
              label: 'Balo chính hãng 1',
              path: "/products/balo/balo-1",
            },
            {
              label: 'Balo chính hãng 2',
              path: "/products/balo/balo-2",
            },
            {
              label: 'Balo chính hãng 3',
              path: "/products/balo/balo-3",
            },
          ]
        },
      ]
    },
    {
      label: 'Liên hệ',
      path: "/contact",
      prominent: true,
    },
    {
      label: 'Tin tức',
      path: "/about-us",
      prominent: true,
    },
    {
      label: 'Giới thiệu',
      path: "/introduce",
      prominent: true,
    },
    {
      label: 'Tuyển dụng',
      path: "/career-path",
      prominent: true,
    },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push({
        pathname: '/search',
        query: { q: searchTerm.trim(), page: 1 }
      });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogin = (e) => {
    // Prevent any default behavior
    if (e) e.preventDefault();

    console.log('Login button clicked, redirecting to /authen/sign-in');

    // Try both methods for redundancy
    window.location.href = '/authen/sign-in';
    router.push('/authen/sign-in');
  };

  const handleRegister = () => {
    router.push('/authen/sign-up');
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const goToAccount = () => {
    setProfileDrawerOpen(false);
    router.push('/profile');
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const toggleProfileDrawer = () => setProfileDrawerOpen(!profileDrawerOpen);

  const toggleExpandItem = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavClick = (path) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const renderNavItems = (items, level = 0) => {
    return items.map((item, idx) => {
      const key = `${level}-${idx}`;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems[key];

      return (
        <div key={key} className="w-100">
          <div
            className={`d-flex justify-content-between align-items-center py-2 px-3 ${level > 0 ? 'ps-4' : ''} ${item.prominent ? 'fw-bold' : ''}`}
            style={{ cursor: 'pointer', paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => hasChildren ? toggleExpandItem(key) : handleNavClick(item.path)}
          >
            <div className="d-flex align-items-center">
              {item.icon && <span className="me-2">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            {hasChildren && (
              <span className="ms-2">
                {isExpanded ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
              </span>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div className="nav-submenu">
              {renderNavItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    setCartCount(getCartCount())
  }, [getCartCount, cartItems])

  // Add a console log to help debug
  useEffect(() => {
    console.log('Auth state:', { isLoggedIn, user });
  }, [isLoggedIn, user]);

  // Create a profile element similar to navigationbar-sample
  const profileElement = useMemo(() => {
    return isLoggedIn && user ? (
      <Avatar
        circle
        style={{
          background: "#111",
          width: "40px",
          height: "40px",
          border: "2px solid #fff",
          borderRadius: "50%",
        }}
      >
        {user?.profile_pic ? (
          <img
            src={user.profile_pic}
            alt="avatar"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        ) : (
          getAvatarCharacter(user?.name || "User")
        )}
      </Avatar>
    ) : (
      <MdAccountCircle size={24} />
    );
  }, [isLoggedIn, user]);

  return (
    <Navbar>
      <Grid fluid className="px-auto">
        {/* Tablet and desktop */}
        <Row className="d-flex align-items-center py-2 d-none d-sm-block ">
          {/* Logo / Brand */}
          <Col xs={0} md={0} />
          <Col className="d-flex justify-content-end" md={4}>
            <Navbar.Brand
              className='d-flex cursor-pointer align-items-center'
              onClick={() => router.push('/')}
            >
              {/* <Image
                src="/images/logo-96.png"
                alt="Logo"
                width={48}
                height={40}
                style={{ height: 40, width: 'auto' }}
              /> */}
              {/* Optional brand text */}
              <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>STORE</span>
            </Navbar.Brand>
          </Col>

          {/* Search Bar (on bigger screens) */}

          <Col md={10} smHidden xsHidden>
            <div className="d-flex align-items-center justify-content-center">
              <InputGroup className='mt-1' style={{ borderRadius: 25, overflow: 'hidden', width: '100%' }}>
                <Input
                  placeholder="Tìm sản phẩm bạn muốn"
                  value={searchTerm}
                  onChange={val => setSearchTerm(val)}
                  onKeyDown={handleSearchKeyDown}
                  style={{
                    height: '48px',
                  }}
                />
                <InputGroup.Button
                  onClick={handleSearch}
                  style={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: 0,
                    border: '1px solid #000'
                  }}
                >
                  <MdSearch />
                </InputGroup.Button>
              </InputGroup>
            </div>
          </Col>

          {/* Filler/spacer for alignment */}
          <Col md={2} className="d-md-none d-lg-block" />

          {/* Login/Logout */}
          <Col md={5} lg={3} className='mt-2 d-flex justify-content-start' style={{ textAlign: 'right' }}>
            {isLoggedIn ? (
              <Nav style={{ bottom: 8 }}>
                <Nav.Menu
                  icon={profileElement}
                  style={{ zIndex: 1080 }}>
                  <div className="mb-3 d-flex flex-column align-items-center my-2">
                    <h4 style={{ fontSize: "18px", fontWeight: "700" }}>
                      {user?.name || "User"}
                    </h4>
                    <Tag
                      style={{
                        background: "#10B981",
                        color: "white",
                        borderRadius: "20px",
                        padding: "2px 12px",
                        marginTop: "5px"
                      }}
                    >
                      {user?.type || "customer"}
                    </Tag>
                  </div>
                  <Dropdown.Item onClick={goToAccount} icon={<MdPerson style={{ fontSize: "16px" }} />}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} icon={<MdLogout style={{ fontSize: "16px" }} />}>
                    Đăng xuất
                  </Dropdown.Item>
                </Nav.Menu>
              </Nav>
            ) : (
              <div className="d-flex justify-content-start">
                <Button 
                  appearance="link" 
                  onClick={handleLogin}
                  as="a" 
                  href="/authen/sign-in"
                >
                  Đăng nhập
                </Button>
                <Button 
                  appearance="link" 
                  onClick={handleRegister}
                  as="a"
                  href="/authen/sign-up"
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </Col>
          <Col md={2} lg={1} className="d-flex justify-content-start">
            <LanguageSwitch />
          </Col>

          {/* Cart Icon */}
          <Col lg={1} md={1} xs={4} className='d-flex justify-content-start' style={{ textAlign: 'center' }}>
            <Nav>
              <Nav.Item
                icon={
                  <Badge 
                    content={cartCount <= 0 ? false : cartCount}>
                    <MdShoppingCart size={24} />
                  </Badge>
                }
                onClick={goToCart}
                style={{ cursor: 'pointer' }}
              />
            </Nav>
          </Col>
          <Col xs={24} hidden={{ md: true, lg: true }} style={{ marginTop: 10 }}>
            <LanguageSwitch />
          </Col>
        </Row>

        {/* Mobile only */}
        <Row className="d-block d-sm-none mb-2 align-items-center">
          {/* Left Side - Logo */}
          <Col xs={8} className="d-flex align-items-center">
            <Navbar.Brand className='d-flex cursor-pointer align-items-center' onClick={() => router.push('/')}>
              <Image src="/images/logo-96.png" alt="Logo" width={32} height={32} style={{ height: 32, width: 'auto' }} />
              <span className="ms-2 fs-6 fw-bold">TEMP STORE</span>
            </Navbar.Brand>
          </Col>

          <Col xs={4}>
            <LanguageSwitch />
          </Col>

          {/* Center - Language Switch & Cart */}
          <Col xs={4} className="d-flex justify-content-center align-items-center">
            {/* Cart icon */}
            <Nav>
              <Nav.Item
                icon={
                  <Badge content={cartCount}>
                    <MdShoppingCart size={20} />
                  </Badge>
                }
                onClick={goToCart}
                style={{ cursor: 'pointer' }}
              />
            </Nav>
          </Col>
          <Col xs={4} className="d-flex justify-content-center align-items-center">
            {isLoggedIn ? (
              <Nav>
                <Nav.Menu icon={profileElement} placement="bottomEnd" style={{ zIndex: 1080 }}>
                  <div className="d-flex flex-column align-items-center">
                    <h4 style={{ fontSize: "18px", fontWeight: "700" }}>{user?.name || "User"}</h4>
                    <Tag style={{ background: "#10B981", color: "white", borderRadius: "20px", padding: "2px 12px", marginTop: "5px" }}>
                      {user?.type || "customer"}
                    </Tag>
                  </div>
                  <Dropdown.Item onClick={goToAccount} icon={<MdPerson style={{ fontSize: "16px" }} />}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} icon={<MdLogout style={{ fontSize: "16px" }} />}>
                    Đăng xuất
                  </Dropdown.Item>
                </Nav.Menu>
              </Nav>
            ) : (
              <Dropdown
                className='mt-1'
                renderToggle={props => (
                  <IconButton {...props} icon={<MdAccountCircle size={28} />} size="md" />
                )}
                placement="bottomStart"
                style={{ zIndex: 1080 }}
                noCaret={true}
              >
                <Dropdown.Item onClick={handleLogin} as="a" href="/authen/sign-in">Đăng nhập</Dropdown.Item>
                <Dropdown.Item onClick={handleRegister} as="a" href="/authen/sign-up">Đăng ký</Dropdown.Item>
              </Dropdown>
            )}
          </Col>

          {/* Right Side - Account & Menu */}
          <Col xs={4} className="d-flex justify-content-end align-items-center">
            {/* Menu icon - Ensuring visibility */}
            <Nav className="justify-self-end">
              <Nav.Item
                icon={<MdMenu size={24} />}
                onClick={toggleDrawer}
              />
            </Nav>
          </Col>
        </Row>

        {/* End of moible only */}
        {/* Mobile only */}
        <Row className="d-block d-sm-none mb-2 mx-2">
          <Col xs={24}>
            <div className="d-flex align-items-center justify-content-center">
              <InputGroup className='mt-1' style={{ borderRadius: 25, overflow: 'hidden', width: '100%' }}>
                <Input
                  placeholder="Tìm sản phẩm bạn muốn"
                  value={searchTerm}
                  onChange={val => setSearchTerm(val)}
                  onKeyDown={handleSearchKeyDown}
                  style={{
                    height: '48px',
                  }}
                />
                <InputGroup.Button
                  onClick={handleSearch}
                  style={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: 0,
                    border: '1px solid #000'
                  }}
                >
                  <MdSearch />
                </InputGroup.Button>
              </InputGroup>
            </div>
          </Col>
        </Row>
        {/* End of moible only */}

      </Grid>

      {/* Navigation Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="xs"
        placement="left"
        className="navigation-drawer"
      >
        <Drawer.Header>
          <Drawer.Title className="fw-bold">Menu</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-0">
          <div className="navigation-menu">
            {renderNavItems(navItems)}
          </div>
        </Drawer.Body>
      </Drawer>
      {/* Add style tag to hide dropdown arrows */}
      <style jsx global>{`
          @media (max-width: 768px) { 
            .rs-navbar-item-caret {
              visibility: hidden;
            }
          }
      `}</style>
    </Navbar>
  );
}
