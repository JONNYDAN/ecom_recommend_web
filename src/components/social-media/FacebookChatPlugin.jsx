import React, { memo, useEffect, useRef } from "react";

const pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID;

const FacebookChatPlugin = () => {
  const chatboxRef = useRef();

  useEffect(() => {
    // Set attributes using chatboxRef
    chatboxRef.current.setAttribute("page_id", pageId);
    chatboxRef.current.setAttribute("attribution", "biz_inbox");

    // Load the Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <div ref={chatboxRef} className="fb-customerchat"></div>
    </div>
  );
};

export default memo(FacebookChatPlugin);
