import { useEffect } from "react";
import useRequest from "../hooks/use-request";
import "bootstrap/dist/css/bootstrap.css";

const AppComponent = ({ Component, pageProps }) => {
  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const { doRequest } = useRequest({
    url: `${authRelativeURL}signout`,
    method: "post",
    body: {},
    onSuccess: () => {},
  });
  
  const handleAlert = async (event) => {
    event.preventDefault();
    event.returnValue = '';
    if (!event.returnValue) {
      await doRequest();
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleAlert);
    return () => {
      window.removeEventListener('beforeunload', handleAlert);
    }
  }, []);

  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
};

export default AppComponent;
