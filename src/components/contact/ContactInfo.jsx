import React from "react";
import { PhoneFill, EmailFill, Wechat } from "@rsuite/icons";
import { FaFacebookMessenger } from "react-icons/fa";
import { localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

function ContactInfo() {
  const { t: tContact } = useLocale(localeItems.contact);
  return (
    <div className="contact-info d-flex flex-column gap-4">
      <div className="shadow phone-info p-4 rounded">
        <span className="d-flex gap-3">
          <PhoneFill />
          <h5>
            <b>Phone:</b>
          </h5>
        </span>
        <p>{tContact("assistance_hours")}: 9 AM to 9 PM (GMT +7)</p>
        <p>
          <b>(+84) 38 981 4400</b>
        </p>
      </div>
      <div className="shadow email-info p-4 rounded">
        <span className="d-flex gap-3">
          <EmailFill />
          <h5>
            <b>Email:</b>
          </h5>
        </span>
        <p>
         {tContact("get_back_to_you")}
        </p>
        <p>
          <b>support@BAOOStore JSC.vn</b>
        </p>
      </div>
      <div className="shadow social-info p-4 rounded">
        <span className="d-flex gap-3">
          <Wechat />
          <h5>
            <b>Livechat:</b>
          </h5>
        </span>
        <p>{tContact("we_are_online_24/7")}</p>
        <div className="d-flex gap-2 align-center">
          <FaFacebookMessenger size={24} color="#00C6FF" />
          {/* <FaSquarePhone size={24} color="green"/> */}
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
