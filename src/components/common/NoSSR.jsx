import useDetectMode from "@/hooks/useDetectMode";

function NoSSR({ children }) {
  const { isClient } = useDetectMode();

  return isClient ? children : null;
}

export default NoSSR;
