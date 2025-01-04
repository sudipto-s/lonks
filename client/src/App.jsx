import Header from './components/Header';
import Footer from './components/Footer';
import { useContext, useEffect } from 'react';
import Main from './components/Main';
import { getCookie } from './utils/userCookie';
import { AppContext } from "./context/AppContext"
import NetworkStatus from './components/NetworkStatus';

const App = () => {
   const { setUser } = useContext(AppContext)

   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   return (
      <>
         <NetworkStatus />
         <Header />
         <Main />
         <Footer />
      </>
   );
};

export default App;