import "bootstrap/dist/css/bootstrap.css";
import buildAuthClient from "../api/buildAuthClient";
import buildTicketsClient from "../api/buildTicketsClient";
import buildOrdersClient from "../api/buildOrdersClient";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { ctx, Component } = appContext;
  const authClient = buildAuthClient(ctx);
  const ticketsClient = buildTicketsClient(ctx);
  const ordersClient = buildOrdersClient(ctx);

  const { data } = await authClient.get("/api/users/currentuser");
  const { currentUser } = data;

  let props = {};
  if (Component.getInitialProps) {
    const pageProps = await Component.getInitialProps(
      ctx,
      authClient,
      ticketsClient,
      ordersClient
    );
    props = { pageProps, currentUser };
  }

  return props;
};

export default AppComponent;
