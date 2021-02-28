import Link from "next/link";

const OrderSuccess = ({ orders }) => {
  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div>
          <h5>Your Order has been completed!</h5>
        </div>
        <div className="d-flex justify-content-around vw-100">
          <Link href="/tickets/new">
            <button className="btn btn-primary">Create another ticket</button>
          </Link>
          <Link href="/">
            <button className="btn btn-primary">Return to home page</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
