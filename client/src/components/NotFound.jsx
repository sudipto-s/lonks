const NotFound = () => {
   return (
      <div className="notfound-container">
         <h1>404</h1>
         <p>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
         <div className="svg-container">
               <svg viewBox="0 0 100 100" className="rocket-svg">
                  <g id="rocket">
                     <rect x="45" y="30" width="10" height="40" fill="#333"></rect>
                     <polygon points="40,30 50,10 60,30" fill="#333"></polygon>
                     <circle cx="50" cy="40" r="5" fill="#fff"></circle>
                  </g>
                  <g id="smoke">
                     <circle cx="50" cy="80" r="5" fill="#bbb"></circle>
                     <circle cx="50" cy="90" r="3" fill="#ccc"></circle>
                  </g>
               </svg>
         </div>
         <a href="#" className="home-btn">Go Home</a>
      </div>
   );
}
 
export default NotFound;