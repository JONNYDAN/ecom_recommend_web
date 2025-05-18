export const localeItems = {
  common: "common",
  header: "header",
  footer: "footer",
  button: "button",
  formRule: "formRule",
  courseCard: "courseCard",
  home: "home",
  searchCourse: "searchCourse",
  courseDetail: "courseDetail",
  aboutUs: "aboutUs",
  signIn: "signIn",
  signUp: "signUp",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  verifyEmail: "verifyEmail",
  errorPage: "errorPage",
  quizDetail: "quizDetail",
  quizExam: "quizExam",
  quizResult: "quizResult",
  quizQuestion: "quizQuestion",
  profile: "profile",
  myCourses: "myCourses",
  payment: "payment",
  paymentResult: "paymentResult",
  contact: "contact",
  ourWork: "ourWork"
};

/**
 * Combine local items with the default configuration
 */
export function combineListLocales(...items) {
  return [
    localeItems.common,
    localeItems.header,
    localeItems.footer,
    localeItems.button,
    ...items,
  ];
}
