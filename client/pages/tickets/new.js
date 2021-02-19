import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/buildClient";
import Header from "../../components/header";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <h1>Create a Ticket</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Submit</button>
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

export default NewTicket;
