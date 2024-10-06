import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      try {
         const { data } = await axios.post("/auth/signup", { username, email, password });
         console.log(data);
         alert("Signup successful!");
      } catch (err) {
         console.error(err);
         setError(err.response?.data?.message || "Signup failed");
      }
   };

   return (
      <div className="auth-container">
         <form onSubmit={handleSubmit} className="auth-form">
            <h2>Signup</h2>
            {error && <p className="error">{error}</p>}
            <input 
               type="text" value={username}
               placeholder="Username" 
               onChange={e => setUsername(e.target.value)} 
               required 
            />
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
            <input 
               type="password" value={confirmPassword} 
               placeholder="Confirm Password" 
               onChange={e => setConfirmPassword(e.target.value)} 
               required 
            />
            <button type="submit">Signup</button>
         </form>
      </div>
   );
};

export default Signup;