import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/buildClient";
import Header from "../../components/header";

const signUpPage = ({ currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const { doRequest, errors } = useRequest({
    url: `${authRelativeURL}signup`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <form onSubmit={onSubmit}>
          <h1>Sign Up</h1>
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const authClient = buildClient(context, "auth");

  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const { data: currentUserData } = await authClient.get(
    `${authRelativeURL}currentuser`
  );
  const { currentUser } = currentUserData;

  return { props: { currentUser } };
};

export default signUpPage;
