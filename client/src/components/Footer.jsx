import '../css/HeaderFooter.css'

const Footer = () => {
   return (
      <footer className="footer">
         <p>&copy; {new Date().getFullYear()} <a href="https://github.com/sudipto-s/lonks">Lonks</a>. All rights reserved.</p>
         <div className="social-media">
            <a href="/s-lonk" target="_blank" rel="noopener noreferrer">GitHub</a> |
            <a href="https://instagram.com/sudipto_.s" target="_blank" rel="noopener noreferrer">Instagram</a> |
            <a href="https://linkedin.com/in/sudipto-singha" target="_blank" rel="noopener noreferrer">LinkedIn</a>
         </div>
      </footer>
   );
};

export default Footer