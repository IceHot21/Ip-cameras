import Layout from '../components/Layout'
import { AppProps } from "next/app";
import '../styles/globals.css'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const hideNavbar = ['/LoginPage/LoginPage'].includes(router.pathname);
  const [numberHome, setNumberHome] = useState<number>(1);
 
  useEffect(() => {
    const savedNumberHome = localStorage.getItem('numberHome');
    if (savedNumberHome) {
      setNumberHome(Number(savedNumberHome));
    }
  }, []);

  return (
    <Layout>
      <main>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} numberHome={numberHome} setNumberHome={setNumberHome} navigate={router.push} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={1}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </main>
    </Layout>
  );
}

export default MyApp;
