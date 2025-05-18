import { useEffect } from "react";

const useDelayedAction = (action, delay) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      action();
    }, delay);

    return () => {
      // Cleanup: Clear the timeout if the component unmounts or if the dependencies change
      clearTimeout(timerId);
    };
  }, [action, delay]);
};

export default useDelayedAction;
