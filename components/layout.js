import Footer from "./footer"; 
import BidsModal from "./modal/bidsModal";
import BuyModal from "./modal/buyModal";
import { useRouter } from "next/router"; 
import Header04 from "./header/Header04";

export default function Layout({ children }) {
  const route = useRouter(); 
  return (
    <>
      <Header04 /> 
      <BidsModal />
      <BuyModal />
      <main>{children}</main>
      <Footer />
    </>
  );
}
