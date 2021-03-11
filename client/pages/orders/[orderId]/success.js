import Link from "next/link";
import { useSession, getSession } from "next-auth/client";
import buildApiClient from "../../../ssr/buildApiClient";

const OrderSuccess = ({ order }) => {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  return session ? (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div>
          <h5>Your Order for {order.ticket.title} has been completed!</h5>
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
  ) : (
    <div>Access Denied</div>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const apiClient = buildApiClient(context);

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;

  const { orderId } = context.query;
  const { data: order } = await apiClient.get(
    `${ordersRelativeURL}/${orderId}`
  );

  return { props: { session, order } };
};

export default OrderSuccess;
