import React from "react";
import { Button, Modal } from "rsuite";

function CustomModal({
  isShow = false,
  children,
  title,
  content,
  okText = "Ok",
  cancelText = "Cancel",
  backdrop = true,
  handleCancel = () => {},
  handleOk = () => {},
}) {
  return (
    <Modal open={isShow} onClose={handleCancel} backdrop={backdrop}>
      {title && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{content || children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCancel} appearance="subtle">
          {cancelText}
        </Button>
        <Button onClick={handleOk} appearance="primary">
          {okText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
