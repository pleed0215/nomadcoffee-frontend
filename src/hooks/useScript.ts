import { useEffect } from "react";

export const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};
