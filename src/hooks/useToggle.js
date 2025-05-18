import { useState } from "react";

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = (newValue) => {
    setValue((prevValue) =>
      typeof newValue === "boolean" ? newValue : !prevValue
    );
  };

  return [value, toggle];
};

export default useToggle;
