const { useState } = require("react");

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    if (typeof event === "string") {
      setValue(event);
    } else {
      // for nomal input
      setValue(event.target.value);
    }
  };

  return {
    value,
    onChange: handleChange,
  };
};

export default useInput;
