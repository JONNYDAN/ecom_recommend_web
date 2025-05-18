import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  Message,
  Panel,
  PanelGroup,
  Row,
  Tag,
  Tooltip,
  Whisper,
} from "rsuite";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MdLockOpen, MdLockOutline } from "react-icons/md";

import Breadcrumb, {
  breadcrumbItems,
} from "@/components/Navigation/Breadcrumb";
import NavLink from "@/components/Navigation/NavLink";
import ConditionalWrapper from "@/components/common/ConditionalWrapper";
import PageContainer from "@/components/common/PageContainer";
import RichText from "@/components/common/RichText";
import SafeImage from "@/components/common/SafeImage";
import SmartCarousel from "@/components/common/SmartCarousel";
import CourseCard, { CourseIconList } from "@/components/courses/CourseCard";
import useMessage from "@/hooks/useMessage";
import { courseService } from "@/services";
import { isAuthenticated } from "@/utils/storageUtils";
import { formatCurrency } from "@/utils/stringUtils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

const breadcrumbs = [
  {
    name: breadcrumbItems.home,
    url: "/",
    isActive: false,
  },
  {
    name: breadcrumbItems.courses,
    url: "/courses",
    isActive: false,
  },
];

export async function getServerSideProps({ req, res, params, locale }) {
  const apis = [courseService.getCourseBySlug(params.slug)];
  const hasToken = isAuthenticated({ req, res });

  if (hasToken) {
    apis.push(
      courseService.getCoursePurchaseStatus(params.slug, {
        headers: req.headers,
      })
    );
  }

  const [{ value: course }, { value: isPurcharsed } = {}] =
    await Promise.allSettled(apis);

  if (!course) {
    return {
      notFound: true,
    };
  }
  course.isPurcharsed = isPurcharsed || false;

  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.courseDetail, localeItems.courseCard)
  );

  return {
    props: {
      course,
      ...translation,
    },
  };
}

function CourseDetailPage({ course }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const router = useRouter();
  const { showToast } = useMessage();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tCourse } = useLocale(localeItems.courseDetail);

  const { data: { data: suggestedCourses = [] } = {} } = useSWR(
    course?.category?.parent_id
      ? ["suggestedCourses", course.category.parent_id]
      : null,
    () =>
      courseService.searchCourses({
        category_ids: [course.category.parent_id],
      })
  );

  const similarCourses = useMemo(
    () => suggestedCourses.filter((item) => item.id !== course.id),
    [course.id, suggestedCourses]
  );

  if (!course) {
    router.replace("/404");
  }

  const metaData = {
    title: `${course.name} - ${tCommon("x_mentor")}`,
    image: `/images/courses/${course.slug}.jpg`,
    ogTypeArticle: true,
    isFollow: true,
  };

  const breadcrumbItems = useMemo(
    () => [
      ...breadcrumbs,
      {
        name: course.name,
        isActive: true,
      },
    ],
    [course.name]
  );

  const handleEnroll = () => {
    const paymentUrl = `/payment?courseId=${course.id}`;

    if (isLoggedIn) {
      // navigate to payment page
      router.push(paymentUrl);
    } else {
      // show notification then redirect user to login page after 3s
      showToast(tCourse("login_to_buy"), {
        duration: 6000,
      });
      setTimeout(() => {
        router.push(
          `/authen/sign-in?redirectUrl=${encodeURIComponent(paymentUrl)}`
        );
      }, 3000);
    }
  };

  const handleClickQuizLink = (event) => {
    // redirect to login page
    if (!isLoggedIn) {
      event.preventDefault();
      event.stopPropagation();

      // show notification then redirect user to login page after 3s
      showToast(tCourse("login_to_access_quiz"), {
        duration: 6000,
      });
      setTimeout(() => {
        router.push(
          `/authen/sign-in?redirectUrl=${encodeURIComponent(router.asPath)}`
        );
      }, 3000);
    }
  };

  const renderPriceAndBuySection = () => {
    if (course.isPurcharsed) {
      return null;
    }

    return (
      <div className="price-card-detail-container">
        <div className="price-card-detail bg-gradient-1">
          <p className="text-light fw-400 mb-3 h4">
            {formatCurrency(course.product_info.price)}
          </p>
          <Button
            className="text-uppercase fw-500 px-4 buy-button"
            appearance="primary"
            color="orange"
            onClick={handleEnroll}
          >
            {tButton("buy_now")}
          </Button>
        </div>
      </div>
    );
  };

  const renderQuestionIcon = (quiz) => {
    if (quiz.is_free) {
      return (
        <Tag className="ms-2 fw-700 text-uppercase" color="green">
          {tCourse("free")}
        </Tag>
      );
    }

    const tooltipWrapper = (children) => (
      <Whisper
        placement="top"
        controlId="control-id-hover"
        trigger="hover"
        speaker={<Tooltip>{tCourse("private_access")}</Tooltip>}
      >
        {children}
      </Whisper>
    );

    return (
      <ConditionalWrapper
        condition={!course.isPurcharsed}
        wrapper={tooltipWrapper}
      >
        <span className="text-18 ms-2">
          {course.isPurcharsed ? (
            <MdLockOpen color="#4caf50" />
          ) : (
            <MdLockOutline color="orange" />
          )}
        </span>
      </ConditionalWrapper>
    );
  };

  const renderQuizAccordionSection = () => {
    if (course.quiz_info?.length > 0) {
      return (
        <>
          <h3 className="mt-4 mb-3">{tCourse("included_in_course")}</h3>

          <PanelGroup accordion bordered>
            {course.quiz_info.map((item, index) => (
              <Panel key={index} header={item.group_name} defaultExpanded>
                {item.quizzes.map((quiz) => (
                  <NavLink
                    key={quiz.id}
                    className="d-flex justify-content-between px-3 py-2 my-1 shadow-sm text-14 mb-3 rounded text-normal"
                    onClick={handleClickQuizLink}
                    href={`/quiz/${quiz.id}`}
                  >
                    <span className="text-link">{quiz.name}</span>

                    <div>
                      <span>
                        {quiz.question_count} {tCourse("questions")}
                      </span>
                      {renderQuestionIcon(quiz)}
                    </div>
                  </NavLink>
                ))}
              </Panel>
            ))}
          </PanelGroup>
        </>
      );
    }

    return null;
  };

  return (
    <PageContainer metaData={metaData}>
      <section className="bg-gradient-11 text-light py-5">
        <div className="container">
          <Breadcrumb
            items={breadcrumbItems}
            itemClassName="breadcrumb-light"
          />
          <Row>
            <Col xs={24} lg={18}>
              <div className="course-detail-header">
                <SafeImage
                  className="course-detail-thumbnail"
                  src={`/images/courses/${course.slug}.jpg`}
                  alt={course.name}
                  height="360"
                  width="640"
                />
                <div>
                  <h1 className="h3 fw-400">{course.name}</h1>
                  <CourseIconList courseInfo={course} itemClassName="pe-4" />
                </div>
              </div>
            </Col>
            {!course.isPurcharsed && (
              <Col
                xs={24}
                md={4}
                lg={6}
                className="pt-3 mt-4 mt-lg-0 d-md-none d-lg-block"
              >
                {renderPriceAndBuySection()}
              </Col>
            )}
          </Row>
        </div>
      </section>

      <div className="container py-4">
        <Row>
          <Col xs={24} md={16}>
            {course.isPurcharsed && (
              <Message type="success" showIcon className="mb-3" closable>
                {tCourse("have_full_access")}
              </Message>
            )}
            <h3>{tCourse("course_overview")}</h3>
            <RichText content={course.description} />
            {renderQuizAccordionSection()}
          </Col>
          <Col xs={24} md={8} className="d-none d-md-block d-lg-none">
            {renderPriceAndBuySection()}
          </Col>
        </Row>
        {similarCourses?.length > 0 && (
          <div className="my-5">
            <h3>{tCourse("similar_course")}</h3>
            <SmartCarousel>
              {similarCourses.map((item) => (
                <div className="card-carousel-item" key={item.id}>
                  <CourseCard className="bg-white" {...item} />
                </div>
              ))}
            </SmartCarousel>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default CourseDetailPage;
