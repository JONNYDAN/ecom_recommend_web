import React from 'react';
import { MdFacebook, MdCall, MdChat, MdArrowUpward } from 'react-icons/md';
// No CSS import needed when using Bootstrap

const FloatingIcons = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Common styles for buttons and icons
  const buttonClass = "btn d-flex align-items-center justify-content-center rounded-circle";
  const buttonSize = { width: '40px', height: '40px' };
  const iconSize = { width: '40px', height: '40px' };
  const phoneIconSize = { width: '40px', height: '40px' }; // Larger size for telephone icon

  return (
    <div className="position-fixed bottom-0 end-0 d-flex flex-column gap-2 p-3" style={{zIndex: 1000}}>
      <a 
        href="https://www.facebook.com/yourpage" 
        target="_blank" 
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Contact us on Facebook"
        style={buttonSize}
      >
         <img src="/images/messenger.webp" alt="Zalo" style={iconSize} />
      </a>
      
      <a 
        href="skype:your.skype.id?chat" 
        className={buttonClass}
        aria-label="Contact us on Skype"
        style={buttonSize}
      >
        <img src="/images/telephone-call.webp" alt="Zalo" style={phoneIconSize} />
      </a>
      
      <a 
        href="https://zalo.me/your-zalo-id" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${buttonClass} btn-primary`}
        style={{ ...buttonSize, backgroundColor: "#028FE3" }}
        aria-label="Contact us on Zalo"
      >
        <img src="/images/zalo-icon.png" alt="Zalo" style={iconSize} />
      </a>
      
      <button 
        onClick={scrollToTop} 
        className={`${buttonClass} btn-secondary`}
        aria-label="Scroll to top"
        style={buttonSize}
      >
        <MdArrowUpward style={iconSize} />
      </button>
    </div>
  );
};

export default FloatingIcons;
