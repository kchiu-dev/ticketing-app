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
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const context = appContext.ctx;
  const authClient = buildAuthClient(context);
  const ticketsClient = buildTicketsClient(context);
  const ordersClient = buildOrdersClient(context);

  const { data } = await authClient.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      context,
      authClient,
      ticketsClient,
      ordersClient,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
