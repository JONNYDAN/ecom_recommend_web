import React from "react";
import { Col, Row, Stack } from "rsuite";
import { 
  MdLocationOn, 
  MdAccessTime, 
  MdPhone, 
  MdVerified, 
  MdFacebook
} from "react-icons/md";
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube 
} from "react-icons/fa";
import Image from "next/image";

function Footer() {
  // Mock data
  const storeInfo = {
    logo: "/images/logo-96.png",
    description: "Store với gần 10 năm kinh nghiệm trong ngành phân phối thời trang Authentic",
    address: "48/34 Trường Chinh, Phường 4, quận Tân Bình, TPHCM",
    hours: "10h sáng - 21h30 tối",
    hotline: "0768 79 3009",
    registration: "Hộ Kinh Doanh Store Giấy chứng nhận đăng ký kinh doanh số 41N8156146. Ngày cấp 14/02/2023. Nơi cấp: Ủy Ban Nhân Dân Quận Tân Bình.",
    verificationBadge: "/verified.png"
  };

  const socialMediaLinks = {
    facebook: "https://www.facebook.com/histore",
    instagram: "https://www.instagram.com/histore",
    tiktok: "https://www.tiktok.com/@histore",
    youtube: "https://www.youtube.com/histore"
  };

  return (
    <footer className="bg-dark text-white mt-3">
      <div className="container py-5">
        <Row>
          {/* Store Information (Left) */}
          <Col lg={6} md={12} xs={24}>
            <div className="mb-4">
              {/* <Image 
                src={storeInfo.logo} 
                alt="Store Logo" 
                width={120} 
                height={60}
                className="bg-white p-1 rounded"
              /> */}
              <p className="mt-3 text-light">{storeInfo.description}</p>
              
              <div className="mt-4">
                <Stack spacing={10} className="align-items-start mb-3">
                  <MdLocationOn className="text-warning mt-1" size={20} />
                  <span className="text-light">{storeInfo.address}</span>
                </Stack>
                
                <Stack spacing={10} className="align-items-start mb-3">
                  <MdAccessTime className="text-warning mt-1" size={20} />
                  <span className="text-light">{storeInfo.hours}</span>
                </Stack>
                
                <Stack spacing={10} className="align-items-start mb-3">
                  <MdPhone className="text-warning mt-1" size={20} />
                  <span className="text-light fw-bold">{storeInfo.hotline}</span>
                </Stack>
                
                <p className="mt-3 text-secondary small">{storeInfo.registration}</p>
                
                <Stack spacing={10} className="align-items-center mt-3">
                  <MdVerified className="text-success" size={22} />
                  <span className="text-light">Đã xác minh</span>
                </Stack>
              </div>
            </div>
          </Col>
          
          {/* Customer Support (Middle) */}
          <Col lg={6} md={12} xs={24}>
            <h5 className="mb-4 text-warning">Hỗ trợ khách hàng</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Hướng dẫn mua hàng</a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Hướng dẫn thanh toán</a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Chính sách vận chuyển</a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Chính sách đổi trả</a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Fundiin</a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-decoration-none text-light hover-warning">Giải quyết khiếu nại</a>
              </li>
            </ul>
          </Col>
          
          {/* Google Map (Middle-Right) */}
          <Col lg={6} md={12} xs={24}>
            <h5 className="mb-4 text-warning">Bản đồ chỉ dẫn Google Map</h5>
            <div className="map-container rounded overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674198073!2d106.6586443!3d10.7812284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad0158a09f%3A0xfd59f8556fb4ca50!2zNDgsIDM0IFRyxrDhu51uZyBDaGluaCwgUGjGsOG7nW5nIDQsIFTDom4gQsOsbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1602835836239!5m2!1svi!2s"
                width="100%"
                height="200"
                className="border-0"
                allowFullScreen=""
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </Col>
          
          {/* Social Media (Right) */}
          <Col lg={6} md={12} xs={24}>
            <h5 className="mb-4 text-warning">Kết nối với Store</h5>
            <Stack spacing={20} className="social-icons">
              <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-light">
                <FaInstagram size={28} className="social-icon" />
              </a>
              <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary">
                <MdFacebook size={28} className="social-icon" />
              </a>
              <a href={socialMediaLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-light">
                <FaTiktok size={28} className="social-icon" />
              </a>
              <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-danger">
                <FaYoutube size={28} className="social-icon" />
              </a>
            </Stack>
          </Col>
        </Row>
      </div>
      
      {/* Bottom Section */}
      <div className="bg-black text-center py-3 border-top border-secondary">
        <div className="container">
          <p className="mb-0 text-secondary">
            © Bản quyền thuộc về Store
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
