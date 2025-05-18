import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FlexboxGrid, Pagination, Panel } from "rsuite";
import NavLink from "../Navigation/NavLink";
import { useTranslation } from "next-i18next";
import { localeItems } from "@/config/localeConfig";
import { MdStart, MdShield, MdHeadphones, MdAttachMoney, MdLocalShipping, MdVerified, MdRateReview, MdSecurity, MdCreditCard, MdSettings } from "react-icons/md";

function IntroductionSection() {
  const { t: tButton } = useTranslation(localeItems.button);
  const { t: tHome } = useTranslation(localeItems.home);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const autoplayTimerRef = useRef(null);
  
  const features = [
    {
      icon: <MdStart size={44} />,
      title: "Bảo hành\nchính hãng",
      description: "Cam kết 100% sản phẩm chính hãng"
    },
    {
      icon: <MdShield size={44} />,
      title: "Dịch vụ\nchuyên nghiệp",
      description: "Đội ngũ chuyên gia giàu kinh nghiệm"
    },
    {
      icon: <MdLocalShipping size={44} />,
      title: "Giao hàng\nnhanh chóng",
      description: "Miễn phí giao hàng toàn quốc"
    },
    {
      icon: <MdHeadphones size={44} />,
      title: "Hỗ trợ\n24/7",
      description: "Giải đáp mọi thắc mắc của khách hàng"
    },
    {
      icon: <MdAttachMoney size={44} />,
      title: "Thanh toán\nđa dạng",
      description: "Nhiều phương thức thanh toán tiện lợi"
    },
    {
      icon: <MdVerified size={44} />,
      title: "Đảm bảo\nchất lượng",
      description: "Sản phẩm đạt tiêu chuẩn cao nhất"
    },
    {
      icon: <MdRateReview size={44} />,
      title: "Đánh giá\nthực tế",
      description: "Phản hồi từ người dùng thực tế"
    },
    {
      icon: <MdSecurity size={44} />,
      title: "Bảo mật\nthông tin",
      description: "Bảo vệ dữ liệu khách hàng"
    },
    {
      icon: <MdCreditCard size={44} />,
      title: "Trả góp\n 0%",
      description: "Hỗ trợ trả góp qua nhiều ngân hàng"
    },
    {
      icon: <MdSettings size={44} />,
      title: "Dịch vụ\nhậu mãi",
      description: "Hỗ trợ kỹ thuật sau bán hàng"
    }
  ];

  // Detect screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 992);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Set up autoplay
  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [activePage]);

  const startAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    autoplayTimerRef.current = setInterval(() => {
      const totalPages = isMobile ? Math.ceil(features.length / 2) : Math.ceil(features.length / 5);
      setActivePage(prevPage => (prevPage % totalPages) + 1);
    }, 5000);
  };

  // Get items per page based on device
  const getItemsPerPage = () => {
    return isMobile ? 2 : 5;
  };

  // Calculate total pages
  const totalPages = Math.ceil(features.length / getItemsPerPage());
  
  // Get current features to display
  const getCurrentFeatures = () => {
    const itemsPerPage = getItemsPerPage();
    const startIndex = (activePage - 1) * itemsPerPage;
    return features.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    startAutoplay();
  };

  return (
    <section className="intro-section">
      {/* Banner Image */}
      <div className="banner-container">
        <Image
          src="/images/banner4.png"
          alt="Banner"
          width={1920}
          height={800}
          className="banner-image"
          priority
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      
      {/* Features Section - Custom Carousel with Pagination */}
      <div className="features-container">
        <Panel className="features-panel">
          <h2 className="mt-2 text-center features-heading mb-4">{tHome('ourStrengths', 'Điểm mạnh của chúng tôi')}</h2>
          
          {/* Features Display */}
          <div className="features-grid">
            <FlexboxGrid justify="space-around" align="middle">
              {getCurrentFeatures().map((feature, index) => (
                <FlexboxGrid.Item 
                  key={index} 
                  colspan={isMobile ? 11 : 4} 
                  className="feature-col"
                >
                  <div className="feature-item">
                    <div className="feature-content">
                      <div className="icon-container">
                        <span>{feature.icon}</span>
                      </div>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </div>
                </FlexboxGrid.Item>
              ))}
            </FlexboxGrid>
          </div>
          
          {/* Pagination Control */}
          <div className="pagination-container">
            <Pagination
              prev
              next
              size="md"
              total={features.length}
              limit={getItemsPerPage()}
              activePage={activePage}
              maxButtons={5}
              layout={['-']}
              onChangePage={handlePageChange}
              className="custom-pagination"
            />
          </div>
        </Panel>
      </div>

      <style jsx>{`
        .intro-section {
          position: relative;
        }
        
        .banner-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .banner-image {
          width: 100%;
          filter: blur(3px);
          transition: all 0.3s ease;
        }
        
        .features-container {
          padding: 0 15px;
          margin-top: -50px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 2;
        }
        
        .features-panel {
          padding: 20px;
          transition: all 0.3s ease;
          border-radius: 16px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
        
        .features-heading {
          color: #ff7eb6;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .features-grid {
          margin-bottom: 20px;
        }
        
        .feature-col {
          padding: 10px;
        }
        
        .feature-item {
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .feature-item:hover {
          transform: translateY(-7px);
        }
        
        .feature-content {
          background: linear-gradient(135deg, #fff9f9, #ffebf3);
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(255, 126, 182, 0.1);
          padding: 20px 15px;
          text-align: center;
          height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 182, 213, 0.2);
          backdrop-filter: blur(5px);
        }
        
        .feature-content:hover {
          background: linear-gradient(135deg, #ffebf3, #fff9f9);
          box-shadow: 0 8px 20px rgba(255, 126, 182, 0.25);
          border: 1px solid rgba(255, 182, 213, 0.4);
        }
        
        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80px;
          width: 80px;
          background-color: rgba(255, 126, 182, 0.1);
          border-radius: 50%;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }
        
        :global(.feature-icon) {
          color: #ff7eb6;
          transition: transform 0.3s ease;
        }
        
        :global(.feature-icon:hover) {
          transform: scale(1.2);
        }
        
        .feature-title {
          white-space: pre-wrap;
          font-weight: 600;
          font-size: 18px;
          background: linear-gradient(135deg, #ff7eb6, #ff5c8a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 8px 0 4px;
          line-height: 1.2;
        }
        
        .feature-description {
          color: #707070;
          font-size: 14px;
        }
        
        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        :global(.custom-pagination) {
          display: inline-flex;
        }
        
        @media (max-width: 768px) {
          .features-container {
            margin-top: -30px;
            padding: 0 10px;
          }

          .features-panel {
            padding: 15px;
            border-radius: 12px;
          }

          .feature-col {
            padding: 10px;
            margin-bottom: 15px;
          }

          .feature-item {
            margin-bottom: 5px;
          }

          .feature-content {
            height: 160px;
            padding: 15px 10px;
            border-radius: 12px;
          }

          .feature-title {
            font-size: 16px;
            margin: 5px 0 3px;
          }

          .feature-description {
            font-size: 13px;
          }
          
          .icon-container {
            height: 60px;
            width: 60px;
            margin-bottom: 8px;
          }
        }
        
        @media (min-width: 769px) and (max-width: 992px) {
          .features-container {
            margin-top: -40px;
          }
          
          .feature-content {
            height: 170px;
          }
          
          .icon-container {
            height: 70px;
            width: 70px;
          }
        }
      `}</style>
    </section>
  );
}

export default IntroductionSection;
