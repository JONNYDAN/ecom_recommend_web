import React, { useState } from 'react';
import { Panel, Row, Col, ButtonToolbar, Button, ButtonGroup, Modal, Form, Rate, Schema, Message, toaster } from 'rsuite';
import { MdStar, MdStarOutline, MdThumbUp, MdFlag, MdImage, MdExpandMore, MdExpandLess } from 'react-icons/md';

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  rating: NumberType().isRequired('Vui lòng chọn số sao'),
  nickname: StringType().isRequired('Vui lòng nhập tên của bạn'),
  email: StringType()
    .isEmail('Vui lòng nhập email hợp lệ')
    .isRequired('Email là bắt buộc'),
  comment: StringType().isRequired('Vui lòng nhập nội dung đánh giá')
});

const ReviewSection = ({ productName, user }) => {
  // State management
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formValue, setFormValue] = useState({
    rating: 5,
    nickname: '',
    email: '',
    comment: ''
  });
  const [formError, setFormError] = useState({});
  const [expandedReviews, setExpandedReviews] = useState(false);

  // Mock data for reviews
  const mockReviews = [
    {
      id: 1,
      nickname: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm chất lượng tuyệt vời, giao hàng nhanh, đóng gói cẩn thận. Tôi rất hài lòng với trải nghiệm mua hàng này!',
      date: '2023-10-15',
      helpful: 12,
      hasImages: true
    },
    {
      id: 2,
      nickname: 'Trần Thị B',
      rating: 4,
      comment: 'Sản phẩm đẹp, chất lượng tốt nhưng giao hàng hơi chậm.',
      date: '2023-10-10',
      helpful: 5,
      hasImages: false
    },
    {
      id: 3,
      nickname: 'Lê Văn C',
      rating: 3,
      comment: 'Sản phẩm tạm được, không như mong đợi nhưng cũng chấp nhận được với mức giá này.',
      date: '2023-10-05',
      helpful: 2,
      hasImages: false
    },
    {
      id: 4,
      nickname: 'Phạm Thị D',
      rating: 5,
      comment: 'Tuyệt vời! Đúng như mô tả, sẽ mua lại.',
      date: '2023-10-01',
      helpful: 8,
      hasImages: true
    },
    {
      id: 5,
      nickname: 'Hoàng Văn E',
      rating: 2,
      comment: 'Sản phẩm không được như hình, hơi thất vọng.',
      date: '2023-09-28',
      helpful: 1,
      hasImages: false
    }
  ];

  // Calculate average rating
  const totalRatings = mockReviews.length;
  const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings || 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  
  // Count ratings by star
  const ratingCounts = {
    5: mockReviews.filter(review => review.rating === 5).length,
    4: mockReviews.filter(review => review.rating === 4).length,
    3: mockReviews.filter(review => review.rating === 3).length,
    2: mockReviews.filter(review => review.rating === 2).length,
    1: mockReviews.filter(review => review.rating === 1).length,
    withImages: mockReviews.filter(review => review.hasImages).length
  };

  // Filter reviews based on selected filter
  const filteredReviews = mockReviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'withImages') return review.hasImages;
    return review.rating === parseInt(filter);
  });

  // Reviews to display (all or just first 3)
  const displayReviews = expandedReviews 
    ? filteredReviews 
    : filteredReviews.slice(0, 3);

  const hasMoreReviews = filteredReviews.length > 3;

  // Toggle expanded reviews state
  const toggleReviews = () => {
    setExpandedReviews(!expandedReviews);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!model.check(formValue)) {
      return;
    }
    
    // Here you would normally send the data to your backend
    
    // Close modal and show thank you message
    setShowModal(false);
    toaster.push(
      <Message type="success">
        Cảm ơn bạn đã đánh giá sản phẩm ❤️
      </Message>
    );
    
    // Reset form
    setFormValue({
      rating: 5,
      nickname: '',
      email: '',
      comment: ''
    });
  };

  // Handle opening the review modal
  const openReviewModal = () => {
    // If user is logged in, pre-fill the form fields
    if (user) {
      setFormValue({
        ...formValue,
        nickname: user.name || '',
        email: user.email || ''
      });
    }
    setShowModal(true);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star-icon">
          {i <= rating ? <MdStar className="text-warning" /> : <MdStarOutline className="text-muted" />}
        </span>
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      <Panel className="p-4 mt-4">
        <h3 className="fw-bold mb-4">Đánh giá sản phẩm</h3>
        
        <Row>
          {/* Overall Rating Summary */}
          <Col xs={24} md={8} className="text-center mb-4">
            <div className="rating-summary">
              <div className="rating-average h1 fw-bold">{roundedAvg.toFixed(1)}</div>
              <div className="rating-stars mb-2">
                {renderStars(Math.round(avgRating))}
              </div>
              <div className="text-dark">
                {totalRatings} đánh giá
              </div>
            </div>
          </Col>
          
          {/* Filter Buttons */}
          <Col xs={24} md={16}>
            <div className="d-flex flex-column mb-4">
              <ButtonToolbar className="mb-3">
                <ButtonGroup>
                  <Button 
                    appearance={filter === 'all' ? 'primary' : 'default'}
                    onClick={() => setFilter('all')}
                  >
                    Tất cả ({totalRatings})
                  </Button>
                  <Button 
                    appearance={filter === '5' ? 'primary' : 'default'}
                    onClick={() => setFilter('5')}
                  >
                    5 Điểm ({ratingCounts[5]})
                  </Button>
                  <Button 
                    appearance={filter === '4' ? 'primary' : 'default'}
                    onClick={() => setFilter('4')}
                  >
                    4 Điểm ({ratingCounts[4]})
                  </Button>
                  <Button 
                    appearance={filter === '3' ? 'primary' : 'default'}
                    onClick={() => setFilter('3')}
                  >
                    3 Điểm ({ratingCounts[3]})
                  </Button>
                  <Button 
                    appearance={filter === '2' ? 'primary' : 'default'}
                    onClick={() => setFilter('2')}
                  >
                    2 Điểm ({ratingCounts[2]})
                  </Button>
                  <Button 
                    appearance={filter === '1' ? 'primary' : 'default'}
                    onClick={() => setFilter('1')}
                  >
                    1 Điểm ({ratingCounts[1]})
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
              
              <ButtonToolbar>
                <Button 
                  appearance={filter === 'withImages' ? 'primary' : 'default'}
                  onClick={() => setFilter('withImages')}
                >
                  <MdImage className="me-1" /> Có hình ảnh ({ratingCounts.withImages})
                </Button>
                
                <Button 
                  appearance="ghost" 
                  color="green"
                  onClick={openReviewModal}
                  className="ms-auto"
                >
                  Gửi đánh giá của bạn
                </Button>
              </ButtonToolbar>
            </div>
          </Col>
        </Row>
        
        {/* Review List */}
        <div className="review-list mt-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center p-5 bg-light rounded">
              <p>Không có đánh giá nào phù hợp với bộ lọc.</p>
            </div>
          ) : (
            <>
              {displayReviews.map(review => (
                <div key={review.id} className="review-item mb-4 pb-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="reviewer-name mb-1">{review.nickname}</h5>
                      <div className="mb-2">
                        {renderStars(review.rating)}
                        <span className="ms-2 text-muted small">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                    {review.hasImages && (
                      <div className="review-image-badge">
                        <MdImage /> Có hình ảnh
                      </div>
                    )}
                  </div>
                  <p className="review-text mb-3">{review.comment}</p>
                  <div className="review-actions d-flex align-items-center">
                    <Button appearance="subtle" size="sm">
                      <MdThumbUp className="me-1" /> Hữu ích ({review.helpful})
                    </Button>
                    <Button appearance="subtle" size="sm" className="ms-2">
                      <MdFlag className="me-1" /> Báo cáo
                    </Button>
                  </div>
                </div>
              ))}
              
              {hasMoreReviews && (
                <div className="text-center mt-3 mb-3">
                  <Button 
                    appearance="ghost" 
                    onClick={toggleReviews}
                    className="expand-reviews-btn"
                  >
                    {expandedReviews ? (
                      <>
                        <MdExpandLess className="me-1" /> Thu gọn
                      </>
                    ) : (
                      <>
                        <MdExpandMore className="me-1" /> Xem thêm {filteredReviews.length - 3} đánh giá
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Panel>
      
      {/* Review Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Đánh giá sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="product-name mb-4">{productName}</h5>
          
          <Form
            fluid
            model={model}
            formValue={formValue}
            onChange={value => setFormValue(value)}
            onCheck={errors => setFormError(errors)}
          >
            <Form.Group controlId="rating">
              <Form.ControlLabel>Đánh giá của bạn:</Form.ControlLabel>
              <Form.Control 
                name="rating" 
                accepter={Rate} 
                defaultValue={5}
                size="lg"
              />
            </Form.Group>
            
            <Form.Group controlId="nickname">
              <Form.ControlLabel>Tên hiển thị:</Form.ControlLabel>
              <Form.Control name="nickname" />
              <Form.HelpText>Tên của bạn sẽ được hiển thị cùng với đánh giá</Form.HelpText>
            </Form.Group>
            
            <Form.Group controlId="email">
              <Form.ControlLabel>Email:</Form.ControlLabel>
              <Form.Control name="email" type="email" />
              <Form.HelpText>Email của bạn sẽ không được hiển thị công khai</Form.HelpText>
            </Form.Group>
            
            <Form.Group controlId="comment" className="w-100">
              <Form.ControlLabel>Nội dung đánh giá:</Form.ControlLabel>
              <Form.Control 
                name="comment" 
                accepter="textarea" 
                rows={5} 
                block
                className="w-100"
                placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..." 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} appearance="subtle">
            Hủy
          </Button>
          <Button onClick={handleSubmit} appearance="primary" color="green">
            Gửi đánh giá
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style jsx>{`
        .rating-summary {
          padding: 1rem;
          border-radius: 8px;
          background-color: #F2F8EC;
          color: white;
        }
        
        .rating-average {
          font-size: 3rem;
          color: #80BB35;
        }
        
        .star-icon {
          font-size: 1.2rem;
          margin-right: 2px;
        }
        
        /* Add color adjustments for better contrast on the new background */
        .rating-count {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        /* Make stars white for better contrast on green background */
        .rating-summary .text-warning {
          color: white !important;
        }
        
        .rating-summary .text-muted {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .review-item {
          transition: all 0.2s ease;
        }
        
        .review-item:hover {
          background-color: rgba(0,0,0,0.01);
        }
        
        .review-image-badge {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
        }
        
        .review-image-badge svg {
          margin-right: 0.25rem;
        }
        
        .review-actions button {
          color: #6c757d;
          transition: color 0.2s ease;
        }
        
        .review-actions button:hover {
          color: #212529;
        }
        
        .expand-reviews-btn {
          transition: all 0.2s ease;
        }
        
        .expand-reviews-btn:hover {
          background-color: #F2F8EC;
        }
        
        :global(.rs-rate-character-before) {
          color: #f8b84e !important;
        }
        
        :global(.rs-modal-body) {
          padding: 1.5rem;
        }
        
        :global(.rs-form-control-wrapper) {
          width: 100%;
        }
        
        :global(textarea.rs-input) {
          width: 100%;
          resize: vertical;
        }
      `}</style>
    </>
  );
};

export default ReviewSection;
