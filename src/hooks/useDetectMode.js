import { useEffect, useState } from "react";

function useDetectMode() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient,
    isServer: !isClient,
  };
}

export default useDetectMode;
