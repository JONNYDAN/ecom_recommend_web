import { convertSourceCategories } from "@/services/sourceService";

const categories = {
  category: [
    {
      id: "d3cff135-6189-4d97-9824-3b32771b178a",
      name: "Quản lý",
    },
  ],
  database: [
    {
      id: "8672de4e-33c2-4c3b-be00-dc5642c9ca66",
      name: "SQL",
    },
    {
      id: "3cd54a2e-db42-458c-acea-8b3ba0364b9f",
      name: "MySQL",
    },
    {
      id: "35ea8d7b-e31e-4593-b8b4-8bf7b30123cf",
      name: "MongoDB",
    },
  ],
  tech: [
    {
      id: "78301add-1b40-4906-ae54-71f7ccfbdf1e",
      name: "NodeJS",
    },
    {
      id: "8215c4ab-e771-46e0-8668-9d3413c36728",
      name: "PHP",
    },
    {
      id: "5620af7d-05f4-4d7c-930d-4e3c935af6c4",
      name: "HTML/CSS/JS",
    },
    {
      id: "934d6c2e-e11b-4c68-bd82-8be94992edc8",
      name: "C#",
    },
    {
      id: "ce7859ad-71bf-483c-a98e-f5a34a775556",
      name: "Python",
    },
    {
      id: "d2b3d6f7-8555-47b3-a78d-54bbd607b19e",
      name: "Golang",
    },
  ],
};

const staticSourceCategories = convertSourceCategories(categories);

export default staticSourceCategories;
