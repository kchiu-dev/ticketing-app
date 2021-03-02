import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";

const signInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const { doRequest, errors } = useRequest({
    url: `${authRelativeURL}/signin`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (user) => {
      sessionStorage.setItem("user", user);
      Router.push("/");
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div>
      <Header currentUser={null} />
      <div className="container">
        <form onSubmit={onSubmit}>
          <h1>Sign In</h1>
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
          <button className="btn btn-primary">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default signInPage;
