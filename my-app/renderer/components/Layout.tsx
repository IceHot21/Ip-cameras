// components/Layout.tsx
import { FC, ReactNode } from "react";


type layoutProps = {
  children: ReactNode,
}

const Layout: FC<layoutProps> = ({ children }) => (
  <>
    {children}
  </>
);

export default Layout

/* 
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default Layout; */