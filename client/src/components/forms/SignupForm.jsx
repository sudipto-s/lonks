import { Link } from "react-router-dom"

const SignupForm = ({ newUser, setNewUser, buttonText }) => {
   const { email, password, confirmPassword } = newUser

   return (
      <>
         <div>
            <input
               type="email" value={email} 
               placeholder="Email" 
               onChange={e =>
                  setNewUser(prev => ({ ...prev, email: e.target.value.trim() }))
               }
               required 
            />
            <input 
               type="password" value={password} 
               placeholder="Password" 
               onChange={e =>
                  setNewUser(prev => ({ ...prev, password: e.target.value.trim() }))
               } 
               required 
            />
            <input 
               type="password" value={confirmPassword} 
               placeholder="Confirm Password" 
               onChange={e =>
                  setNewUser(prev => ({ ...prev, confirmPassword: e.target.value.trim() }))
               } 
               required 
            />
            <button type="submit">{buttonText}</button>
         </div>
         <div className="already-have-account form-links">
            <span>Already have an account? </span>
            <Link className="login-link" to="/app/login">Login</Link>
         </div>
      </>
   )
}

export default SignupForm