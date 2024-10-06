import { useState } from 'react';
import axios from 'axios';

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.post("/auth/login", { email, password });
         console.log(response.data);
         alert("Login successful!");
      } catch (err) {
         console.error(err);
         setError(err.response?.data?.message || "Login failed");
      }
   };

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input 
               type="email" value={email}
               placeholder="Email" 
               onChange={e => setEmail(e.target.value)} 
               required 
            />
            <input 
               type="password" value={password}
               placeholder="Password" 
               onChange={e => setPassword(e.target.value)} 
               required 
            />
            <button type="submit">Login</button>
         </form>
      </div>
   );
};

export default Login;