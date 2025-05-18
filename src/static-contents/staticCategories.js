import { convertCategories } from "@/services/courseService";

const categories = [
  {
    id: "2b3d7176-7755-4705-ac49-6588c1d86a03",
    name: "Certified Openstack Administrator",
    parent_id: "",
    order_id: 7,
  },
  {
    id: "9b363d2d-e7e5-4f87-93f3-27f9224f22f2",
    name: "Certified Openstack Administrator",
    parent_id: "",
    order_id: 7,
  },
  {
    id: "d0b88c8d-0590-48f1-99bd-04fe226d1ae7",
    name: "Certified Openstack Administrator",
    parent_id: "",
    order_id: 7,
  },
  {
    id: "f9920e2e-6846-4ca6-bf3b-35d7a093fde7",
    name: "Amazon Web Services",
    parent_id: "",
    order_id: 1,
  },
  {
    id: "ccf5d04a-78ba-4948-b8db-c45b2de63f3b",
    name: "Microsoft Azure",
    parent_id: "",
    order_id: 2,
  },
  {
    id: "441f8fd6-598d-4d0d-bac9-97d9fb515172",
    name: "Six Sigma and Lean",
    parent_id: "",
    order_id: 21,
  },
  {
    id: "3ce7a410-75c8-42c2-acaf-a6311eb050e8",
    name: "Oracle/Java Certifications",
    parent_id: "",
    order_id: 22,
  },
  {
    id: "8844ba9c-7be1-43a9-8672-26998d38c019",
    name: "Cloud Security Alliance",
    parent_id: "",
    order_id: 23,
  },
  {
    id: "3c65dbfa-331b-4a03-9c65-31a462097ffc",
    name: "Blockchain Certifications",
    parent_id: "",
    order_id: 24,
  },
  {
    id: "27c7f128-f04f-451a-a11f-c826ae92d0e5",
    name: "Robotic Process Automation (RPA)",
    parent_id: "",
    order_id: 25,
  },
  {
    id: "9bfceea2-a225-499b-8202-d75ba38a4b6c",
    name: "VMware",
    parent_id: "",
    order_id: 26,
  },
  {
    id: "2e593aca-0c04-4b88-9b37-f9238c0e82c8",
    name: "Learn Kubernetes with AWS And Docker",
    parent_id: "",
    order_id: 27,
  },
  {
    id: "6f08a49a-08bb-4492-ab0d-5b1d6cabc01c",
    name: "Git and Github training Course",
    parent_id: "",
    order_id: 28,
  },
  {
    id: "82e9e792-404a-4d38-b7aa-3b337de49255",
    name: "Git Fundamental Training Course",
    parent_id: "",
    order_id: 29,
  },
  {
    id: "8ae9c9a4-4b56-489d-9116-56c43f9c98d5",
    name: "Prince2® Certifications",
    parent_id: "",
    order_id: 30,
  },
  {
    id: "7fa7e653-8163-4606-b3f0-baf726251695",
    name: "#100DaysOfCloud",
    parent_id: "",
    order_id: 34,
  },
  {
    id: "8bd41b9c-d81c-4edc-8df6-06cacdd08296",
    name: "Retired Courses",
    parent_id: "",
    order_id: 35,
  },
  {
    id: "8be3b1b8-92dd-4fcf-8915-dc9f4bf4bd49",
    name: "Google Cloud Platform",
    parent_id: "",
    order_id: 5,
  },
  {
    id: "862b1808-72a4-49c3-9212-a7a36d9d176e",
    name: "Microsoft",
    parent_id: "",
    order_id: 6,
  },
  {
    id: "593b8ae1-2841-4881-8214-1dc8cdf68afe",
    name: "Snowflake",
    parent_id: "",
    order_id: 8,
  },
];

const staticCategories = convertCategories(categories);

export default staticCategories;
