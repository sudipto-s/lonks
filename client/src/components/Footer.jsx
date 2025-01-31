import '../css/HeaderFooter.css'

const Footer = () => {
   return (
      <footer className="footer">
         <p className="s-lonk">
            &copy; {new Date().getFullYear()} &nbsp;
            <span target="_blank" rel="noopener noreferrer"
            >Lonks</span>. All rights reserved.
            @Sudipto
         </p>
         <div className="social-media">
            <a href="https://github.com/sudipto-s" target="_blank" rel="noopener noreferrer">GitHub</a> |
            <a href="https://instagram.com/sudipto_.s" target="_blank" rel="noopener noreferrer">Instagram</a> |
            <a href="https://linkedin.com/in/sudipto-singha" target="_blank" rel="noopener noreferrer">LinkedIn</a> |
            <a href="https://iconoir.com" target="_blank" rel="noopener noreferrer">Iconoir</a>
         </div>
      </footer>
   );
};

export default Footer