import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Carousel, Loader, Message } from "rsuite";
import Image from "next/image";
import { useScreenSize } from "@/contexts/ScreenSizeContext";
import { API_URL } from "@/config/constants";
function CustomerFeedbackSection() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isMobile } = useScreenSize();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/feedbacks`);
                const data = await response.json();
                
                if (data.success) {
                    setFeedbacks(data.data);
                } else {
                    setError('Failed to load customer feedbacks');
                }
            } catch (err) {
                setError('Error loading feedbacks: ' + err.message);
                console.error('Error fetching feedbacks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return (
            <section className="customer-feedback-section py-5">
                <div className="container text-center">
                    <h2 className="mb-4">Phản hồi từ khách hàng</h2>
                    <Loader size="lg" content="Đang tải phản hồi..." vertical />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="customer-feedback-section py-5">
                <div className="container">
                    <h2 className="text-center mb-4">Phản hồi từ khách hàng</h2>
                    <Message type="error" header="Lỗi" className="mx-auto" style={{ maxWidth: '600px' }}>
                        {error}
                    </Message>
                </div>
            </section>
        );
    }

    return (
        <section className="customer-feedback-section py-5">
            <div className="container">
                <h2 className="text-center mb-4">Phản hồi từ khách hàng</h2>
                {isMobile ? (
                    <Carousel autoplay className="custom-slider" style={{ height: 450 }} autoplayInterval={5000}>
                        {feedbacks.map((feedback) => (
                            <div key={feedback._id} className="feedback-item bg-white text-center d-flex flex-column pb-1">
                                <Image
                                    src={feedback.image || "/images/feedback_5.png"}
                                    alt={`Feedback from ${feedback.customerName}`}
                                    width={200}
                                    height={300}
                                    className="feedback-image align-self-center"
                                />
                                <p className="feedback-description">{feedback.feedback}</p>
                                <p className="feedback-customer font-weight-bold">{feedback.customerName}</p>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <Grid fluid>
                        <Row className="equal-height-row">
                            {feedbacks.map((feedback) => (
                                <Col key={feedback._id} lg={8} md={12} sm={24} className="mb-4">
                                    <div className="feedback-item text-center p-3 bg-white rounded shadow-sm d-flex flex-column w-100">
                                        <div className="feedback-image-container mb-3">
                                            <Image
                                                src={feedback.image || "/images/feedback_5.png"}
                                                alt={`Feedback from ${feedback.customerName}`}
                                                width={200}
                                                height={300}
                                                className="feedback-image"
                                            />
                                        </div>
                                        <div className="feedback-content">
                                            <p className="feedback-description">{feedback.feedback}</p>
                                        </div>
                                        <p className="feedback-customer max-line-2 font-weight-bold mt-auto">{feedback.customerName}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Grid>
                )}
            </div>

            <style jsx>{`
        .feedback-item {
          transition: all 0.3s ease;
          height: 100%;
          min-height: 350px;
          display: flex;
          flex-direction: column;
        }
        .feedback-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .feedback-image-container {
          display: flex;
          justify-content: center;
        }
        .feedback-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .feedback-description {
          font-size: 1rem;
          color: #333;
        }
        .feedback-customer {
          font-size: 1.1rem;
          color: #000;
        }
        .equal-height-row {
          display: flex;
          flex-wrap: wrap;
        }
        .max-line-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limit text to 2 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
        </section>
    );
}

export default CustomerFeedbackSection;