import { useEffect, useState } from "react";
import { parseRoute } from "../utils/router.js";

export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to) {
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to);
      setRoute(parseRoute(to));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return { route, navigate };
}
