export function scrollTo(top, left = 0) {
  window.scrollTo({
    top,
    left,
    behavior: "smooth",
  });
}

export function downloadContent(content, name) {
  // Create a URL from the response blob
  const url = window.URL.createObjectURL(new Blob([content]));
  // Create an anchor tag to trigger the download
  const link = document.createElement("a");
  link.href = url;
  let fileName = `${name} - ${+new Date()}.zip`; // Default to a filename in case one isn't found
  link.setAttribute("download", fileName); // Set the download attribute to the filename
  document.body.appendChild(link);
  link.click(); // Trigger the download
  document.body.removeChild(link); // Clean up
  window.URL.revokeObjectURL(url); // Free up memory
}
