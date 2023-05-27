import { RecoilRoot } from "recoil";
import { ChatContextProvider } from "../context/ChatContext";
import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import nProgress from "nprogress";

function MyApp({ Component, pageProps }) {
  nProgress.configure({ showSpinner: false });

  return (
    <RecoilRoot>
      <ChatContextProvider>
        <NextNProgress color="#E50914" />
        <Component {...pageProps} />
      </ChatContextProvider>
    </RecoilRoot>
  );
}

export default MyApp;
