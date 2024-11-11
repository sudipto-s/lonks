import '../css/HeaderFooter.css'

const Footer = () => {
   return (
      <footer className="footer">
         <p className="s-lonk">
            &copy; {new Date().getFullYear()} &nbsp;
            <a href="/s-lonk">Lonks</a>. All rights reserved.
            @Sudipto
         </p>
         <div className="social-media">
            <a href="//github.com/sudipto-s" target="_blank" rel="noopener noreferrer">GitHub</a> |
            <a href="//instagram.com/sudipto_.s" target="_blank" rel="noopener noreferrer">Instagram</a> |
            <a href="//linkedin.com/in/sudipto-singha" target="_blank" rel="noopener noreferrer">LinkedIn</a> |
            <a href="//iconoir.com" target="_blank" rel="noopener noreferrer">Iconoir</a>
         </div>
      </footer>
   );
};

export default Footer