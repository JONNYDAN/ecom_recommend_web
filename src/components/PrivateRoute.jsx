import { useRouter } from "next/router";

function PrivateRoute({ condition = () => false, children }) {
  const router = useRouter();
  const pathName = router.pathname;

  if (typeof condition !== "function") return null;

  return condition(pathName) ? children : null;
}

export default PrivateRoute;
