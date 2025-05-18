import useMessage from "@/hooks/useMessage";
import { contactService } from "@/services";
import { forwardRef, useRef, useState } from "react";
import { Button, Col, Form, Input, Row } from "rsuite";

const Textarea = forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

function ContactForm() {
  const { showToast } = useMessage();
  const formRef = useRef(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleFormSubmit = async () => {
    const status = await contactService.sendContact(data);

    if (status) {
      showToast(
        "Thank for your information, we will contact to you in 24 hours"
      );
    } else {
      showToast("Some errors occured!", { type: "error" });
    }
  };
  return (
    <Form
      className="mt-2"
      ref={formRef}
      onChange={setData}
      formValue={data}
      fluid
    >
      <Row>
        <Col xs={24} lg={12} className="mb-3">
          <Form.Group>
            <Form.Control name="name" type="text" placeholder="Your Name" />
          </Form.Group>
        </Col>
        <Col xs={24} lg={12} className="mb-3">
          <Form.Group>
            <Form.Control name="email" type="email" placeholder="Your Email" />
          </Form.Group>
        </Col>
        <Col xs={24} lg={12} className="mb-3">
          <Form.Group>
            <Form.Control name="phone" type="text" placeholder="Phone number" />
          </Form.Group>
        </Col>
        <Col xs={24} lg={12} className="mb-3">
          <Form.Group>
            <Form.Control
              name="company"
              type="text"
              placeholder="Your Company"
            />
          </Form.Group>
        </Col>
        <Col xs={24} className="mb-3">
          <Form.Group>
            <Form.Control
              name="subject"
              type="text"
              placeholder="Your subject"
            />
          </Form.Group>
        </Col>
        <Col xs={24} className="mb-3">
          <Form.Group>
            <Form.Control
              name="message"
              rows={5}
              accepter={Textarea}
              placeholder="Enter your message..."
            />
          </Form.Group>
        </Col>
        <Col xs={24} className="mb-3">
          <Button
            onClick={handleFormSubmit}
            appearance="primary"
            type="submit"
            // loading={isLoading}
            // disabled={isLoading}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ContactForm;
