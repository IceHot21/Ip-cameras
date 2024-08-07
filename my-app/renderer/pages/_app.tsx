// pages/_app.tsx
import Layout from '../components/Layout'
import { AppProps } from "next/app";
import '../styles/globals.css'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const hideNavbar = ['/LoginPage/LoginPage'].includes(router.pathname)
  return (
    <Layout>
      <main>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
      </main>
    </Layout>
  )
}

export default MyApp;

