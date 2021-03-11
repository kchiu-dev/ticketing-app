import { useState } from "react";
import Router from "next/router";
import { useSession, getSession } from "next-auth/client";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";

const NewTicket = () => {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

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

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return session ? (
    <div>
      <Header session={session} />
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
  ) : (
    <div>Access Denied</div>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: { session },
  };
};

export default NewTicket;
