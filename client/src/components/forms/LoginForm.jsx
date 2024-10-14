import { Link } from "react-router-dom"

const LoginForm = ({ email, setEmail, password, setPassword, error, buttonText, handleSubmit }) => {
   return (
      <form onSubmit={handleSubmit} className="auth-form">
         <h2>Login</h2>
         {error && <p className="error">{error}</p>}
         <div>
            <input 
               type="email" value={email}
               placeholder="Email" 
               onChange={e => setEmail(e.target.value?.trim().toLowerCase())}
               required 
            />
            <input 
               type="password" value={password}
               placeholder="Password" 
               onChange={e => setPassword(e.target.value)} 
               required 
            />
            <button type="submit">{buttonText}</button>
         </div>
         <div className="forgot-password">
            <Link to="/app/login">Forgot password?</Link>
         </div>
         <div className="dont-have-account form-links">
            <span>Don&apos;t have an account? </span>
            <Link className="signup-link" to="/app/signup">Signup</Link>
         </div>
      </form>
   );
}
 
export default LoginForm;