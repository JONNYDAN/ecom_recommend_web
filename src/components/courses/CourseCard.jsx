import React from "react";
import clsx from "clsx";
import { Button } from "rsuite";
import TextTruncated from "@/components/common/TextTruncated";
import {
  MdLayers,
  MdPlaylistAddCheck,
  MdSchool,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useRouter } from "next/router";
import { getRawText, slugify } from "@/utils/stringUtils";
import NavLink from "../Navigation/NavLink";
import SafeImage from "../common/SafeImage";
import useLocale from "@/hooks/useLocale";
import { localeItems } from "@/config/localeConfig";

export function CourseIconList({ courseInfo = {}, itemClassName }) {
  const { t: tCourse } = useLocale(localeItems.courseCard);
  const { practice_test_count, question_count, purchased_count } = courseInfo;
  const iconsList = [];

  if (practice_test_count) {
    iconsList.push({
      icon: <MdLayers color="deepskyblue" size="20" />,
      text: `${practice_test_count} ${tCourse("practice_test")}`,
    });
  }

  if (question_count) {
    iconsList.push({
      icon: <MdPlaylistAddCheck color="orange" size="20" />,
      text: `${question_count} ${tCourse("question")}`,
    });
  }

  if (purchased_count) {
    iconsList.push({
      icon: <MdSchool color="lightseagreen" size="20" />,
      text: `${purchased_count} ${tCourse("learner")}`,
    });
  }

  return iconsList.length > 0
    ? iconsList.map(({ icon, text }, index) => (
        <span key={index} className={itemClassName}>
          {icon} {text}
        </span>
      ))
    : null;
}

function CourseCard({
  description,
  id,
  name,
  practice_test_count,
  purchased_count,
  question_count,
  slug,
  className,
}) {
  const { t: tButton } = useLocale(localeItems.button);
  const router = useRouter();
  const rawDescription = getRawText(description);
  const courseImage = slug || slugify(name);

  const navigateDetail = () => {
    router.push(`/courses/${slug}`);
  };

  return (
    <div
      className={clsx("course-card-container p-0 shadow", className)}
      onClick={navigateDetail}
    >
      <SafeImage
        src={`/images/courses/${courseImage}.jpg`}
        height="270"
        width="480"
        className="course-thumbnail"
        alt={name}
      />
      <div className="course-card-content py-3 px-2">
        <NavLink
          className="h6 mb-2 fw-500 text-color-inherit"
          href={`/courses/${slug}`}
        >
          {name}
        </NavLink>
        <TextTruncated className="mb-2 text-14" lines={2}>
          {rawDescription}
        </TextTruncated>
        <div className="course-meta-container">
          <div className="course-icons-container">
            <CourseIconList
              courseInfo={{
                practice_test_count,
                question_count,
                purchased_count,
              }}
              itemClassName="text-12 text-md-14 text-muted"
            />
          </div>
          <Button
            className="course-see-detail-button text-14 rounded-pill px-3 me-2"
            size="sm"
            appearance="link"
            as={NavLink}
            href={`/courses/${slug}`}
            endIcon={<MdOutlineKeyboardDoubleArrowRight />}
          >
            {tButton("see_detail")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
