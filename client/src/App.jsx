import Header from './components/Header';
import Footer from './components/Footer';
import { useContext, useEffect } from 'react';
import Main from './components/Main';
import { getCookie } from './utils/userCookie';
import { AppContext } from "./context/AppContext"
import NetworkStatus from './components/NetworkStatus';
import { Toaster } from 'sonner';

const App = () => {
   const { setUser } = useContext(AppContext)

   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [setUser])

   return (
      <>
         <Toaster
            position="top-center"
            closeButton={true}
            expand={false}
            richColors
            toastOptions={{style: { fontSize: '14px' }}}
         />
         <NetworkStatus />
         <Header />
         <Main />
         <Footer />
      </>
   );
};

export default App;