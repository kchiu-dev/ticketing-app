import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header {...pageProps} />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default AppComponent;
