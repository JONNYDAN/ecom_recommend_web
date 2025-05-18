// Format the date and time
const defaultOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false, // Use 24-hour format
};

// default is in format: 22:45 23/4/2020
export function formatDateTime(str, options = {}) {
  try {
    const time = new Date(str);

    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      options,
    }).format(time);
  } catch (err) {
    console.log("Can not format time: ", err.message);
  }
  return "Invalid time";
}
