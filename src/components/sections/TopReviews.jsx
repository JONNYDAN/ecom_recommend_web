import { useState } from "react";
import SmartCarousel from "../common/SmartCarousel";
import FeedbackCard from "./FeedbackCard";
import { useTranslation } from "next-i18next";
import { localeItems } from "@/config/localeConfig";

const mockReviewData = [
  {
    name: "Duc Do",
    jobRole: "Software Engineer",
    rating: 5.0,
    feedbackTitle: "A Comprehensive Learning Platform",
    feedbackContent:
      "BAOOStore JSC offers a well-rounded combination of course materials, videos, exercises, hands-on practice, and exam questions with answers. It's a holistic solution for preparing for exams, acquiring knowledge, and enhancing skills, with a special focus on cloud-based learning.",
  },
  {
    name: "Tran Van Thanh",
    jobRole: "Software Engineer",
    rating: 5.0,
    feedbackTitle: "Key to Certification Success",
    feedbackContent:
      "I discovered BAOOStore JSC two years ago and utilized it to achieve my certifications. This platform is exceptional for practicing and obtaining the certifications you desire. Extensive practice with exam questions boosted my confidence. I wholeheartedly recommend it to anyone seeking knowledge and certification success.",
  },
  {
    name: "Quoc Nguyen",
    jobRole: "Software Engineer",
    rating: 5.0,
    feedbackTitle: "Outstanding Practice Examinations",
    feedbackContent:
      "The practice exams on BAOOStore JSC are impressive and ensure exam success. The detailed explanations provided will help you master the essential concepts required for your certifications.",
  },
  {
    name: "Hoang Tran",
    jobRole: "Software Engineer",
    rating: 5.0,
    feedbackTitle: "Learning and Succeeding in Certifications",
    feedbackContent:
      "My goal was to attain certification and gain a deep understanding of AWS. With BAOOStore JSC, I not only learned but also passed the certification, acquiring a solid grasp of the topics.",
  },
  {
    name: "Nguyen Van Duy",
    jobRole: "Software Engineer",
    rating: 5.0,
    feedbackTitle: "BAOOStore JSC is the Ultimate IT Certification Companion",
    feedbackContent:
      "Whether it's AWS, Azure, or any technology, BAOOStore JSC is the ultimate platform for IT certification preparation. It's consistently delivered value, helping me successfully complete all my exams through its practice questions and labs, fostering confidence and knowledge acquisition.",
  },
];

function TopReviews() {
  const [reviewList] = useState(mockReviewData);
  const { t: tHome } = useTranslation(localeItems.home);
  return (
    <div className="py-5 bg-gradient-5">
      <h2 className="text-center mb-5">{tHome("review_heading")}</h2>
      <SmartCarousel>
        {reviewList.map((item, index) => (
          <FeedbackCard key={index} {...item} />
        ))}
      </SmartCarousel>
    </div>
  );
}

export default TopReviews;
