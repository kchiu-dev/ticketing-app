import "bootstrap/dist/css/bootstrap.css";

import { Provider } from 'next-auth/client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default AppComponent;
