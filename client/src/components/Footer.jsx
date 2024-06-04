import React from 'react';
//import "./style.css"


const Footer = () => {
   let date = new Date().getFullYear();
    return (
     <footer className="footer">
       <div className='footer-content'>
         <span>Ready Check✅</span>
         <a href="https://github.com/jasongalas/ready-check" target="_blank" rel="noopener noreferrer">
           <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="github-logo" />
         </a>
       </div>
       <div className="footer-date">©{date}</div>
     </footer>
   );
 }
  export default Footer;
