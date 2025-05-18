import React from "react";
import { Message, useToaster } from "rsuite";

const defaultOptions = {
  // message option
  showIcon: true,
  type: "info", // 'info' | 'success' | 'warning' | 'error'
  closable: true,
  className: "",

  // toast options
  placement: "topCenter", // 'topStart' | 'topCenter' | 'topEnd' | 'bottomStart' | 'bottomCenter' | 'bottomEnd'
  duration: 5000,
  onClose: () => {},
};

function useMessage() {
  const toaster = useToaster();

  const showToast = (message = "", options) => {
    const toastOptions = {
      ...defaultOptions,
      ...options,
    };

    const {
      showIcon,
      type,
      closable,
      className,
      placement,
      duration,
      onClose,
    } = toastOptions;

    const messageOptions = { showIcon, type, closable, className };
    const pushOptions = { placement, duration, onClose };

    const messageElement = <Message {...messageOptions}>{message}</Message>;

    toaster.push(messageElement, pushOptions);
  };

  const clearToasts = () => {
    toaster.clear();
  };
  return { showToast, clearToasts };
}

export default useMessage;
