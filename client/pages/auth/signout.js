import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const { doRequest } = useRequest({
    url: `${authRelativeURL}signout`,
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};
