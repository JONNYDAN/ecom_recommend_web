import "rsuite/dist/rsuite.min.css";
import "@/styles/main.scss";
import ReactGA from 'react-ga';
import { CustomProvider } from "rsuite";
import { IconContext } from "react-icons";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";

import NavigationBar from "@/components/Navigation/NavigationBar";
import HeaderBar from "@/components/Navigation/HeaderBar";
import PrivateRoute from "@/components/PrivateRoute";
import { wrapper } from "@/redux";
import { setAuthState } from "@/redux/auth/authSlice";
import { useEffect } from "react";
import { getToken, getUser } from "@/utils/storageUtils";
import { ScreenSizeProvider } from "@/contexts/ScreenSizeContext";
import Footer from "@/components/shared/Footer";
import FacebookChatPlugin from "@/components/social-media/FacebookChatPlugin";
import { CartProvider } from '@/contexts/CartContext';
import CartModal from '@/components/CartModal/CartModal';
import nextI18NextConfig from "../../next-i18next.config";

const emptyInitialI18NextConfig = {
  i18n: {
    locales: nextI18NextConfig.i18n.locales,
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
  },
};

const showNav = (pathName) => {
  return ![
    "/authen/sign-in",
    "/authen/sign-up",
    "/authen/reset-password",
    "/authen/forgot-password",
    "/authen/verify-email",
    "/authen/google-login",
  ].includes(pathName);
};

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  useEffect(() => {
    // add Google Analytics
    ReactGA.initialize('G-4NYJ7TMFSP'); // Replace with your Measurement ID
    ReactGA.pageview(window.location.pathname + window.location.search);
    
    // ----
    const isLoggedIn = store.getState()?.auth?.isLoggedIn;

    if (!isLoggedIn) {
      // load authentication data
      const token = getToken();
      const user = getUser();
      console.log("token", user?.id);

      if (token && user?.id) {
        store.dispatch(setAuthState({ user, isLoggedIn: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <CartProvider>
        <ScreenSizeProvider>
          <CustomProvider>
            <IconContext.Provider value={{ className: "rs-icon" }}>
              <PrivateRoute condition={showNav}>
                <HeaderBar />
                <NavigationBar />
              </PrivateRoute>
              <Component {...props.pageProps} />
              <PrivateRoute condition={showNav}>
                <Footer />
                <FacebookChatPlugin />
              </PrivateRoute>
            </IconContext.Provider>
          </CustomProvider>
          <CartModal />
        </ScreenSizeProvider>
      </CartProvider>
    </Provider>
  );
}

export default appWithTranslation(App, emptyInitialI18NextConfig); // Makes sure the initial i18n instance is not undefined
