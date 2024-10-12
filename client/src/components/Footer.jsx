import '../css/HeaderFooter.css'

const Footer = () => {
   return (
      <footer className="footer">
         <p>&copy; {new Date().getFullYear()} Lonks. All rights reserved.</p>
         <div className="social-media">
            <a href="https://instagram.com/sudipto_.s" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com/in/sudipto-singha" target="_blank" rel="noopener noreferrer">LinkedIn</a>
         </div>
      </footer>
   );
};

export default Footer