import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import Main from './components/Main';
import { getCookie } from './utils/userCookie';

const App = () => {
   const [user, setUser] = useState(null)

   useEffect(() => {
      const cok = getCookie()
      cok && setUser({ ...cok })
   }, [])

   return (
      <Router>
         <Header user={user} setUser={setUser} />
         <Main user={user} setUser={setUser} />
         <Footer />
      </Router>
   );
};

export default App;