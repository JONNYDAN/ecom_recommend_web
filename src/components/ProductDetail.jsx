import React, { useState } from 'react';
import { Container, Row, Col, Panel, ButtonGroup, Button, Divider, Stack, List, Whisper, Tooltip } from 'rsuite';
import { MdStar, MdStarBorder, MdReply, MdFlag, MdFilterList } from 'react-icons/md';

const ProductDetail = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [ratingFilter, setRatingFilter] = useState(null);

  // Handle thumbnail image selection
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  // Handle rating filter
  const handleRatingFilter = (rating) => {
    setRatingFilter(ratingFilter === rating ? null : rating);
  };

  // Get filtered reviews
  const filteredReviews = ratingFilter
    ? product.rating.reviews.filter(review => review.rating === ratingFilter)
    : product.rating.reviews;

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<MdStar key={i} className="text-warning" />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-muted" />);
      }
    }
    return stars;
  };

  return (
    <Container>
      <Row>
        {/* Product Images Section */}
        <Col xs={24} md={12} lg={12}>
          <Panel shaded className="p-3">
            <img 
              src={product.images[selectedImageIndex]} 
              alt={product.name}
              className="w-100 mb-3"
              style={{ objectFit: 'contain', height: '400px' }}
            />
            <Row>
              {product.images.map((image, index) => (
                <Col xs={6} key={index}>
                  <div 
                    className={`cursor-pointer p-1 ${selectedImageIndex === index ? 'border border-primary' : ''}`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-100"
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Panel>
        </Col>

        {/* Product Information Section */}
        <Col xs={24} md={12} lg={12}>
          <Panel className="p-3">
            <h2 className="fw-bold mb-4">{product.name}</h2>
            
            <Divider />
            
            <h5 className="fw-bold mb-3">Thông tin chi tiết</h5>
            <List>
              {product.description.map((item, index) => (
                <List.Item key={index} className="ps-2">
                  {item}
                </List.Item>
              ))}
            </List>
            
            <Divider />
            
            {/* Customer Rating Summary */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Đánh giá sản phẩm</h5>
              <Stack spacing={10} className="align-items-center mb-3">
                <span className="fs-3">{product.rating.average}</span>
                <div>
                  {renderStars(product.rating.average)}
                  <div className="text-muted mt-1">
                    {product.rating.total} đánh giá
                  </div>
                </div>
              </Stack>
            </div>
          </Panel>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row className="mt-4">
        <Col xs={24}>
          <Panel className="p-3">
            <Stack justifyContent="space-between" className="mb-4">
              <h5 className="fw-bold m-0">Đánh giá của khách hàng</h5>
              <Stack spacing={10}>
                <Whisper placement="top" trigger="hover" speaker={<Tooltip>Lọc theo đánh giá</Tooltip>}>
                  <Button appearance="subtle" className="p-1">
                    <MdFilterList size={20} />
                  </Button>
                </Whisper>
                <ButtonGroup>
                  {[5, 4, 3, 2, 1].map(star => (
                    <Button 
                      key={star}
                      appearance={ratingFilter === star ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handleRatingFilter(star)}
                    >
                      {star} <MdStar />
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
            </Stack>

            {/* Review List */}
            {filteredReviews.length > 0 ? (
              <List>
                {filteredReviews.map((review, index) => (
                  <List.Item key={index} className="mb-3">
                    <Panel bordered className="p-3">
                      <Stack justifyContent="space-between">
                        <h6 className="fw-bold">{review.username}</h6>
                        <span className="text-muted small">{review.date}</span>
                      </Stack>
                      <div className="my-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="my-2">{review.text}</p>
                      <Stack spacing={10} className="mt-3">
                        <Button appearance="subtle" size="sm">
                          <MdReply /> Trả lời
                        </Button>
                        <Button appearance="subtle" size="sm">
                          <MdFlag /> Báo cáo
                        </Button>
                      </Stack>
                    </Panel>
                  </List.Item>
                ))}
              </List>
            ) : (
              <div className="text-center p-5 text-muted">
                Không có đánh giá nào phù hợp với bộ lọc hiện tại
              </div>
            )}
          </Panel>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
