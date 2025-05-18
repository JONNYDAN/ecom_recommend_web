import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PageContainer from "@/components/common/PageContainer";
import Image from "next/image";
import React from "react";
import { Col, Row, Panel } from "rsuite";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.aboutUs)
  );

  return {
    props: {
      ...translation,
    },
  };
}

function AboutUsPage() {
  const { t: tAboutUs } = useLocale(localeItems.aboutUs);
  return (
    <PageContainer
      metaData={{
        title: tAboutUs("meta_title"),
      }}
    >
      <div className="bg-gradient-1 py-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div className="my-5 d-flex justify-content-center flex-column align-items-center text-uppercase text-light">
          <h1>{tAboutUs("heading")}</h1>
          <h5>{tAboutUs("slogan")}</h5>
        </div>
        <Image
          src="/images/about-us/key-success.svg"
          width={360}
          height={360}
          alt="Mission"
          style={{
            width: "auto",
          }}
        />
        <div></div>
      </div>
      <div className="container my-5 pt-2">
        {/* Company Introduction */}
        <Row className="mb-5">
          <Col xs={24} mdOffset={1} md={22} lgOffset={2} lg={20}>
            <h2 className="text-center mb-4">Giới thiệu</h2>
            <p className="text-justify">
              Khám phá trải nghiệm mua sắm chính hãng tại BAOOStore. Với gần 10 năm kinh nghiệm phân phối các thương hiệu nổi tiếng trên thế giới, sản phẩm có nguồn gốc rõ ràng với dịch vụ tận tâm. Giao hàng nhanh toàn quốc và quốc tế.
            </p>
            
            <p className="text-justify mt-4">
              BAOOStore tự hào là địa chỉ phân phối hàng chính hãng uy tín hàng đầu với gần 10 năm kinh nghiệm trên thị trường. Chúng tôi cam kết mang đến cho bạn những sản phẩm có nguồn gốc, xuất xứ minh bạch, đẹp chuẩn, đảm bảo chất lượng cao cấp từ các thương hiệu nổi tiếng thế giới, đáp ứng nhu cầu đa dạng của khách hàng trong và ngoài nước. Mỗi sản phẩm tại BAOOStore không chỉ là một món hàng mà còn là biểu tượng của phong cách sống sang trọng và đẳng cấp.
            </p>
            
            <p className="text-justify mt-3">
              Tại BAOOStore, khách hàng luôn là trung tâm của mọi dịch vụ. Chúng tôi xây dựng một trải nghiệm mua sắm độc đáo, từ việc tư vấn tận tâm đến các chính sách hỗ trợ hậu mãi vượt trội. BAOOStore không chỉ giúp bạn sở hữu sản phẩm chính hãng mà còn mang lại sự hài lòng tuyệt đối và niềm tự hào khi trở thành khách hàng của chúng tôi. Mỗi sản phẩm trước khi đến tay khách hàng đều trải qua quy trình kiểm định nghiêm ngặt, đảm bảo đáp ứng các tiêu chuẩn khắt khe nhất về chất lượng và an toàn. Điều này giúp củng cố vị thế của BAOOStore như một trong những địa điểm mua sắm uy tín hàng đầu, nơi khách hàng có thể tin tưởng mỗi khi tìm kiếm sản phẩm chính hãng.
            </p>
            
            <p className="text-justify mt-3">
              Chúng tôi tự hào là đối tác của nhiều công ty và tập đoàn lớn, không chỉ trong việc phân phối sản phẩm mà còn trong việc cung cấp hàng hóa cho các sự kiện marketing và các hoạt động thương mại khác, giúp các đối tác doanh nghiệp thực hiện các chiến dịch quảng bá sản phẩm hiệu quả. Sự hợp tác này bao gồm việc cung cấp hàng hóa cho các chương trình khuyến mãi lớn, các hội nghị thương mại và các sự kiện đặc biệt, đảm bảo rằng các sự kiện của đối tác luôn có sự hỗ trợ về sản phẩm chất lượng cao. Với uy tín đã được xây dựng, BAOOStore được biết đến là đối tác đáng tin cậy, có khả năng cung cấp một lượng lớn sản phẩm chính hãng với điều kiện bảo quản và giao hàng chuyên nghiệp. Chúng tôi tự hào góp phần vào thành công của nhiều chiến dịch marketing, nâng tầm giá trị thương hiệu cho đối tác.
            </p>
            
            <p className="text-justify mt-3">
              BAOOStore hiểu rõ nhu cầu của khách hàng, chúng tôi cung cấp dịch vụ giao hàng cực kỳ nhanh chóng. Chỉ trong vòng 1-2 tiếng sau khi đặt hàng, bạn đã có thể nhận được sản phẩm của mình (áp dụng nội thành SG cho thanh toán chuyển khoản). Đây là dịch vụ đặc biệt hữu ích cho những ai cần mua hàng gấp hoặc cho các dịp đặc biệt. Không chỉ dừng lại ở Sài Gòn, BAOOStore mở rộng dịch vụ giao hàng nhanh chóng của mình đến mọi miền của đất nước. Dù bạn ở bất kỳ đâu tại Việt Nam, BAOOStore đảm bảo giao hàng nhanh chóng và an toàn, giúp bạn tiếp cận với hàng hóa chính hãng một cách nhanh nhất có thể.
            </p>
            
            <p className="text-justify mt-3">
              Không chỉ phục vụ khách hàng trong nước, BAOOStore cũng mở rộng dịch vụ giao hàng đến quốc tế. Chúng tôi hợp tác với các đối tác vận chuyển uy tín, đảm bảo hàng hóa của bạn được giao đến tận tay một cách an toàn và hiệu quả, dù bạn ở bất kỳ đâu trên thế giới. Với BAOOStore, bạn không chỉ mua được sản phẩm chính hãng mà còn được trải nghiệm dịch vụ giao hàng nhanh chóng và chuyên nghiệp. Chúng tôi luôn nỗ lực để đáp ứng và vượt qua kỳ vọng của khách hàng về một trải nghiệm mua sắm trực tuyến tiện lợi và đáng tin cậy.
            </p>
            
            <p className="text-justify mt-3">
              Khi bạn chọn mua sắm tại BAOOStore, bạn không chỉ đơn thuần sở hữu một sản phẩm mà còn khẳng định gu thẩm mỹ tinh tế và phong cách sống thời thượng. Những sản phẩm từ BAOOStore là minh chứng cho sự đẳng cấp của bạn, khiến bạn nổi bật trong mọi hoàn cảnh. Chúng tôi tin rằng, mỗi món đồ bạn chọn tại đây sẽ là điểm nhấn giúp bạn tỏa sáng, thể hiện sự khác biệt và làm cho mọi ánh nhìn đều phải ngưỡng mộ sự sành điệu của bạn. BAOOStore không chỉ bán sản phẩm, chúng tôi mang đến giá trị và sự tự hào cho phong cách sống của bạn.
            </p>
            
            <div className="mt-4">
              <h4 className="fw-bold">BAOOStore - Nơi Sự Cao Cấp Tạo Nên Giá Trị Riêng</h4>
              
              <p className="mt-3">
                <strong>Địa chỉ:</strong> 48/34 Trường Chinh, P4, Tân Bình<br />
                <a href="https://maps.google.com/?q=48/34+Truong+Chinh+P4+Tan+Binh" target="_blank" rel="noopener noreferrer">
                  Xem địa điểm trên Google Maps
                </a><br />
                <strong>Hotline:</strong> 𝟎𝟕𝟔𝟖 𝟕𝟗 𝟑𝟎𝟎𝟗
              </p>
            </div>
          </Col>
        </Row>

      </div>
    </PageContainer>
  );
}

export default AboutUsPage;
