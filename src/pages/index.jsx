import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageContainer from "@/components/common/PageContainer";
import ExamSimulator from "@/components/sections/ExamSimulator";
import HotProducts from "@/components/sections/HotProducts";
import AllProducts from "@/components/sections/AllProducts";
import IntroductionSection from "@/components/sections/IntroductionSection";
import TopReviews from "@/components/sections/TopReviews";
import { courseService } from "@/services";
import { combineListLocales } from "@/config/localeConfig";

import 'bootstrap/dist/css/bootstrap.css';
import CustomerFeedbackSection from "@/components/sections/CustomerFeedback";
import FashionNews from "@/components/sections/FashionNews";
import FloatingIcons from "../../components/FloatingIcons";

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("home")
  );

  return {
    props: {
      ...translation,
    },
  };
}

export default function Home({ bestCourses, trendingCourses }) {
  return (
    <PageContainer metaData={{
      isFollow: true,
    }}>
      <IntroductionSection />
      <HotProducts />
      {/* <AllProducts />       */}
      {/* <TopReviews /> */}
      {/* <CustomerFeedbackSection /> */}
      {/* <FashionNews /> */}
      {/* <FloatingIcons /> */}
    </PageContainer>
  );
}
