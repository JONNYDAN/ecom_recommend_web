import { useEffect, useState } from "react";

function getSavedValue(key, initialValue) {
  try {
    const savedValue = JSON.parse(localStorage.getItem(key));
    return savedValue;
  } catch (err) {}

  return initialValue instanceof Function ? initialValue() : initialValue;
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getSavedValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}
