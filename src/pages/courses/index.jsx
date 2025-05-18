import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// components
import {
  Button,
  CheckTreePicker,
  Col,
  Content,
  Input,
  InputGroup,
  Loader,
  Message,
  Pagination,
  Placeholder,
  Row,
  Stack,
} from "rsuite";
import Breadcrumb, {
  breadcrumbItems,
} from "@/components/Navigation/Breadcrumb";

// icons
import CloseIcon from "@rsuite/icons/Close";
import CourseCard from "@/components/courses/CourseCard";
import SearchIcon from "@rsuite/icons/Search";

// hooks
import useToggle from "@/hooks/useToggle";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useScreenSize } from "@/contexts/ScreenSizeContext";

// others
import { courseService } from "@/services";
import PageContainer from "@/components/common/PageContainer";
import { debounce } from "lodash-es";
import staticCategories from "@/static-contents/staticCategories";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

const FILTER_BOX_CLASS_NAME = "course-filter-container";
const SEARCH_DELAY_TIME = 400;

const breadcrumbs = [
  {
    name: breadcrumbItems.home,
    url: "/",
    isActive: false,
  },
  {
    name: breadcrumbItems.courses,
    url: "/courses",
    isActive: true,
  },
];

const CourseItemComponent = (item) => {
  return <div className="text-ellipsis">{item.label}</div>;
};

function getQueryData(query = {}) {
  const categoryIds = query.category_ids;
  let categoryIdsQuery = null;

  if (categoryIds) {
    categoryIdsQuery =
      categoryIds instanceof Array ? categoryIds : [categoryIds];
  }

  return {
    ...(query.keyword ? { keyword: query.keyword } : {}),
    ...(query.page ? { page: query.page } : {}),
    ...(categoryIdsQuery ? { category_ids: categoryIdsQuery } : {}),
  };
}

export async function getServerSideProps({ query, locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.searchCourse, localeItems.courseCard)
  );

  return {
    props: {
      query,
      ...translation,
    },
  };
}

function CoursePage({ query }) {
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tCourses } = useLocale(localeItems.searchCourse);
  const router = useRouter();

  const [courseListQuery, setCourseListQuery] = useState(() =>
    getQueryData(query)
  );

  const [searchKey, setSearchKey] = useState(query.keyword || "");

  const {
    data: categoryList = staticCategories,
    error: categoryListError,
    isLoading: categoryListIsLoading,
  } = useSWR("groupCategories", () => courseService.getGroupCategories());

  const {
    data: { data: courseList, totalPage } = {},
    error: courseListError,
    isLoading: courseListIsLoading,
  } = useSWR(["courseList", courseListQuery], () =>
    courseService.searchCourses(courseListQuery)
  );

  const [showFilter, toggleShowFilter] = useToggle(false);
  const [filterBoxMetric, setFilterBoxMetric] = useState({ width: "0px" });

  const screenSize = useScreenSize();

  const maxPageButtons = useMemo(() => {
    // default in mobile
    let size = 5;

    if (screenSize.isGreaterThan.lg) {
      size = 9;
    } else if (screenSize.isGreaterThan.md) {
      size = 7;
    }

    return size;
  }, [screenSize.isGreaterThan]);

  const delaySearchByKeyword = useMemo(
    () =>
      debounce((value) => {
        setCourseListQuery((query) => ({ ...query, keyword: value, page: 1 }));
      }, SEARCH_DELAY_TIME),
    []
  );

  const handleChangeSearchKeyword = (value) => {
    setSearchKey(value);
    delaySearchByKeyword(value);
  };

  const handleToggleFilter = () => {
    if (screenSize.isSmallerThan.lg) {
      toggleShowFilter();
    }
  };

  const filterBoxFooter = () => {
    // only render in lg and smaller screen
    if (screenSize.isGreaterThan.lg) {
      return null;
    }

    return (
      <Stack justifyContent="flex-end" className="p-3">
        <Button onClick={handleToggleFilter} endIcon={<CloseIcon />}>
          {tButton("close")}
        </Button>
      </Stack>
    );
  };

  const renderCourseList = () => {
    if (courseListIsLoading) {
      // TODO: Improve loading card placeholder
      return (
        <div>
          <Placeholder.Paragraph rows={8} />
          <Loader backdrop content="loading..." vertical />
        </div>
      );
    }

    if (!courseList?.length) {
      return (
        <Message showIcon type="info" header={tCourses("no_result_title")}>
          {tCourses("no_result_description")}
        </Message>
      );
    }

    return (
      <div className="card-list-grid">
        {courseList.map((item) => (
          <CourseCard
            key={item.id}
            {...item}
            className="horizontal-layout-desktop"
          />
        ))}
      </div>
    );
  };

  const handleChangePage = (page) => {
    const newQuery = {
      ...courseListQuery,
      page,
    };

    setCourseListQuery(newQuery);
  };

  const handleChangeFilterCategory = (value) => {
    setCourseListQuery((query) => ({ ...query, category_ids: value, page: 1 }));
  };

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: courseListQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListQuery]);

  useEffect(() => {
    // hide filter in md & lower devices ann show it in large device by default
    toggleShowFilter(screenSize.isGreaterThan.md);

    const caculateFilterBoxMetric = () => {
      const filterBox = document.querySelector(`.${FILTER_BOX_CLASS_NAME}`);

      if (filterBox) {
        setFilterBoxMetric({
          width: `${filterBox.offsetWidth || 0}px`,
        });
      }
    };

    caculateFilterBoxMetric();

    window.addEventListener("resize", caculateFilterBoxMetric);

    return () => window.removeEventListener("resize", caculateFilterBoxMetric);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize.breakpoint]);

  const renderPagination = () => {
    return courseList?.length ? (
      <Stack justifyContent="center">
        <Pagination
          className="mt-4"
          first
          last
          prev={screenSize.isGreaterThan.md}
          next={screenSize.isGreaterThan.md}
          size="sm"
          total={totalPage}
          limit={1}
          activePage={+(courseListQuery.page || 1)}
          onChangePage={handleChangePage}
          boundaryLinks
          ellipsis
          maxButtons={maxPageButtons}
        />
      </Stack>
    ) : null;
  };

  return (
    <PageContainer
      className="full-height"
      metaData={{
        title: tCourses("meta_title"),
        isFollow: true,
      }}
    >
      <div className="bg-gradient-5 pt-4 pb-5">
        <Content className="container">
          <Breadcrumb items={breadcrumbs} />
          <Stack justifyContent="center">
            <InputGroup inside>
              <Input
                placeholder={tCourses("search_placeholder")}
                value={searchKey}
                onChange={handleChangeSearchKeyword}
                style={{ width: screenSize.isGreaterThan.xs ? 360 : 240 }}
              />
              <InputGroup.Button>
                <SearchIcon />
              </InputGroup.Button>
            </InputGroup>
          </Stack>
        </Content>
      </div>

      <Content className="container mt-3 mb-5">
        <Row>
          <Col xs={24} md={24} lg={24}>
            <div className="ps-lg-3">{renderCourseList()}</div>
            {renderPagination()}
          </Col>
        </Row>
      </Content>
    </PageContainer>
  );
}

export default CoursePage;
