import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import Loader1 from "./Loader1"; 

export const RouterLoader = () => {
    const location = useLocation();
    const [active, setActive] = useState(false);
    useEffect(() => {
    // Start loader when route starts
    setActive(true);

    // Stop loader (simulate routeChangeComplete)
    const timeout = setTimeout(() => {
      setActive(false);
    }, 400); // small delay so loader is visible

    return () => clearTimeout(timeout);
  }, [location.pathname]);
    return (
        <>
            {active ? <h1>Loading</h1> : null}
        </>
    )
}
