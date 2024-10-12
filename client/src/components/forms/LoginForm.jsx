const LoginForm = ({ email, setEmail, password, setPassword, error, buttonText, handleSubmit }) => {
   return (
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
         <button type="submit">{buttonText}</button>
      </form>
   );
}
 
export default LoginForm;