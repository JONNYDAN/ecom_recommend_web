import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PageContainer from "@/components/common/PageContainer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import Image from "next/image";
import { Col, Row, Panel, Divider } from "rsuite";
import useLocale from "@/hooks/useLocale";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaBuilding } from "react-icons/fa";

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.contact)
  );

  return {
    props: {
      ...translation,
    },
  };
}

function ContactUsPage() {
  const { t: tContact } = useLocale(localeItems.contact);
  
  const storeAddress = "48/34 Trường Chinh, Phường 4, quận Tân Bình, TP Hồ Chí Minh";
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(storeAddress)}`;

  return (
    <PageContainer
      metaData={{
        title: "Liên hệ - BAOOStore",
        isFollow: true,
      }}
    >
      <div className="bg-gradient-1 py-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div className="my-5 d-flex justify-content-center flex-column align-items-center text-uppercase text-light">
          <h1>Liên Hệ</h1>
          <h5>Kết nối với BAOOStore</h5>
        </div>
        <Image
          src="/images/about-us/key-success.svg"
          width={360}
          height={360}
          alt="Contact"
          style={{
            width: "auto",
          }}  
        />
      </div>

      <div className="container py-5">
        <Row className="d-flex flex-wrap">
          {/* Left side - Contact Information */}
          <Col xs={24} md={12} className="mb-4">
              <div className="p-4">
                <h3 className="mb-4 fw-bold">BAOOStore</h3>
                
                <div className="d-flex align-items-start mb-3">
                  <FaMapMarkerAlt className="me-3 mt-1" size={20} style={{ color: "#2b3990" }}/>
                  <div>
                    <strong>Địa chỉ:</strong><br/>
                    48/34 Trường Chinh, Phường 4, quận Tân Bình, TP Hồ Chí Minh
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="me-3" size={18} style={{ color: "#2b3990" }}/>
                  <div>
                    <strong>Email:</strong> historesaigon@gmail.com
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaBuilding className="me-3" size={18} style={{ color: "#2b3990" }}/>
                  <div>
                    <strong>Doanh nghiệp liên hệ:</strong> tungtran@historesaigon.vn
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaPhoneAlt className="me-3" size={18} style={{ color: "#2b3990" }}/>
                  <div>
                    <strong>Hotline:</strong> 0768 79 3009
                  </div>
                </div>

              </div>
          </Col>
          
          {/* Right side - Google Map */}
          <Col xs={24} md={12} className="mb-4">
              <div className="p-4">
                <h3 className="mb-4 fw-bold">Vị trí cửa hàng</h3>
                <div className="map-container" style={{ height: "500px", width: "100%" }}>
                  <iframe 
                    src={mapUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="BAOOStore Location"
                  ></iframe>
                </div>
              </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
}

export default ContactUsPage;
