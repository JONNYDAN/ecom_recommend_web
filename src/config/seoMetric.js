export const defaultMetaData = {
  title: "BAOOStore JSC Academy",
  description:
    "Access over 250 IT certification practice tests. Study and practice at your preferred pace using our exclusive content. Enhance your skills today to pave the way for a more promising future.",
  favicon: "/favicon.ico",
  image: "/images/default-og-image.jpg",
};

export const getCombineMetaData = (metaData) => {
  return { ...defaultMetaData, ...metaData };
};
