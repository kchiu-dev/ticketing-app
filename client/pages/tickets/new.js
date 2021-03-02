import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";

const NewTicket = () => {
  const [currentUser, setCurrentUser] = useState();
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

  useEffect(() => {
    const currentUserSession = sessionStorage.getItem("user");
    currentUserSession ? setCurrentUser(currentUserSession) : Router.push("/");
  }, []);

  return currentUser ? (
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
  ) : (
    <div>Loading</div>
  );
};

export default NewTicket;
