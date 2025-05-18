import api from "./api";
import querystring from "querystring";

// Recursive function to convert categories and sub-categories
function convertCategory(category) {
  const { id, name, sub_categories } = category;

  const convertedCategory = {
    value: id,
    label: name,
    children: null,
    // children:
    //   sub_categories?.length > 0 ? sub_categories.map(convertCategory) : null, // Recursively convert sub-categories
  };

  return convertedCategory;
}

// Function to convert original categories into the desired structure
export function convertCategories(categories) {
  if (categories instanceof Array) {
    return categories
      .map(convertCategory)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  return [];
}

export function transformCourseDetail(course) {
  if (!course?.id) {
    return null;
  }

  const additionalFields = {};

  const freeTestItem = [...course.quiz_info].find((item) =>
    item.group_name.includes("Free Test")
  );

  if (freeTestItem?.quizzes?.length) {
    additionalFields.firstFreeTest = freeTestItem.quizzes[0];
    additionalFields.hasFreeTest = true;
  }

  return { ...course, ...additionalFields };
}

const courseService = {
  getGroupCategories: async () => {
    try {
      const response = await api.get("/api/exam/group-categories");

      if (response.success) {
        return convertCategories(response.data);
      }
    } catch (error) {
      console.log("Can not get categories ", error.message);
    }

    return [];
  },

  searchCourses: async (query = {}) => {
    try {
      const queryData = { ...query };
      // remove category_ids if it's empty
      if (!queryData.category_ids || queryData?.category_ids?.length === 0) {
        delete queryData.category_ids;
      }
      const serializedQuery = querystring.stringify(queryData);
      const response = await api.get(`/api/exam/courses?${serializedQuery}`);

      if (response.success) {
        return {
          data: response.data,
          totalPage: response.total_page,
          page: response.page,
        };
      }
    } catch (error) {
      console.log("Can not get categories ", error.message);
    }
    return { data: [], totalPage: 0 };
  },

  getCourseById: async (id) => {
    if (!id) {
      return null;
    }

    try {
      const response = await api.get(`/api/exam/courses/${id}`);

      if (response.success && response.data?.id) {
        return transformCourseDetail(response.data);
      }
    } catch (error) {
      console.log("Can not get course detail ", error.message);
    }

    return null;
  },

  getCourseBySlug: async (slug) => {
    if (!slug) {
      return null;
    }

    try {
      const response = await api.get(`/api/exam/courses/slugs/${slug}`);

      if (response.success && response.data?.id) {
        return transformCourseDetail(response.data);
      }
    } catch (error) {
      console.log("Can not get course detail ", error.message);
    }

    return null;
  },

  getCoursePurchaseStatus: async (courseSlug, options) => {
    try {
      const response = await api.get(
        `/api/exam/courses/slugs/${courseSlug}/purchased-status`,
        options
      );

      if (response.success) {
        return response.data?.is_purchased;
      }
    } catch (error) {
      console.log("Can not get course status ", error.message);
    }

    return false;
  },

  getMyCourses: async (query = {}) => {
    try {
      const serializedQuery = querystring.stringify(query);
      // TODO: improve this API with pagination feature
      const response = await api.get(`/api/exam/my-courses?${serializedQuery}`);

      if (response.success) {
        return {
          data: response.data,
          totalPage: response.total_page,
          page: response.page,
        };
      }
    } catch (error) {
      console.log("Can not get categories ", error.message);
    }
    return { data: [], totalPage: 0 };
  },

  getTrendingCourses: async () => {
    try {
      const response = await api.get(`/api/exam/trending-courses`);

      if (response.success) {
        const { best_course: bestCourses, trending: trendingCourses } =
          response.data;
        return {
          bestCourses,
          trendingCourses,
        };
      }
    } catch (error) {
      console.log("Can not get trending courses ", error.message);
    }

    return {
      bestCourses: [],
      trendingCourses: [],
    };
  },
};

export default courseService;
