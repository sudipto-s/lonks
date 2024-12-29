const SignupForm = ({ otp, setOtp, buttonText }) => {
   return (
      <>
         <div>
            <input
               type="number" value={otp} 
               maxLength={6}
               placeholder="Enter OTP" 
               onChange={e => setOtp(e.target.value)} 
               required 
            />
            <button type="submit" disabled={buttonText === "Verifying OTP.."}>{buttonText}</button>
         </div>
      </>
   );
}
 
export default SignupForm;