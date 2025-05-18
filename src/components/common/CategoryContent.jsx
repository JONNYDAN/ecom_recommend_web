import React from 'react';
import { 
  Panel, 
  Row, 
  Col, 
  Stack,
} from 'rsuite';
import { MdStore, MdPhone, MdLocationOn } from "react-icons/md";

export function CategoryContent({ categoryName }) { 
    return (
      <Panel className="mt-3">
        <h3 className="mb-4">Giới thiệu về {categoryName}</h3>
        
        {/* Introduction Section */}
        <Row className="mb-4">
          <Col xs={24}>
            <p>
              {categoryName} là dòng sản phẩm đồ chơi nghệ thuật được yêu thích bởi giới trẻ và giới sưu tầm.
              Hãy khám phá thêm <a href="/products" className="text-primary fw-bold">bộ sưu tập đặc biệt</a> của chúng tôi.
            </p>
          </Col>
        </Row>
  
        {/* Category Details */}
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <h4 className="fw-bold">Xuất xứ</h4>
            <p>
              {categoryName} được thiết kế và sản xuất tại Trung Quốc bởi những nghệ sĩ tài năng.
              Mỗi sản phẩm đều được kiểm tra chất lượng nghiêm ngặt trước khi đến tay người dùng.
            </p>
            
            <h4 className="fw-bold mt-4">Chất liệu</h4>
            <p>
              Sản phẩm được làm từ nhựa vinyl cao cấp, an toàn và không chứa chất độc hại.
              Quy trình sản xuất tuân theo các tiêu chuẩn quốc tế về đồ chơi.
            </p>
            <ul>
              <li>Nhựa vinyl cao cấp</li>
              <li>Không chứa BPA</li>
              <li>Màu sắc an toàn, không độc hại</li>
            </ul>
          </Col>
          
          <Col xs={24} md={12}>
            <h4 className="fw-bold">Đặc điểm nổi bật</h4>
            <p>
              {categoryName} nổi bật với thiết kế độc đáo và tính nghệ thuật cao.
              Từng chi tiết nhỏ đều được chăm chút tỉ mỉ, tạo nên những sản phẩm có tính thẩm mỹ vượt trội.
            </p>
            <ul>
              <li>Thiết kế độc đáo, sáng tạo</li>
              <li>Chi tiết tinh xảo, tỉ mỉ</li>
              <li>Màu sắc đa dạng, bắt mắt</li>
              <li>Giá trị sưu tầm cao</li>
            </ul>
            
            <h4 className="fw-bold mt-4">Tại sao {categoryName} được yêu thích?</h4>
            <p>
              {categoryName} không chỉ là món đồ chơi thông thường mà còn là tác phẩm nghệ thuật đương đại.
              Giới trẻ và giới sưu tầm yêu thích {categoryName} vì tính độc đáo, hiếm có và giá trị thẩm mỹ cao.
            </p>
          </Col>
        </Row>
  
        {/* Buying Guide Section */}
        <Panel className="mt-5 bg-light p-4">
          <h4 className="fw-bold">Mua {categoryName} chính hãng ở đâu?</h4>
          <Row className="mt-3">
            <Col xs={24} md={12}>
              <Stack spacing={10}>
                <MdStore size={20} />
                <span className="fw-bold">Histore Saigon</span>
              </Stack>
              <p className="mt-2">
                Địa chỉ: 123 Nguyễn Trãi, Quận 1, TP.HCM
              </p>
              <Stack spacing={10} className="mt-2">
                <MdPhone size={18} />
                <span>Hotline: 0123 456 789</span>
              </Stack>
            </Col>
            <Col xs={24} md={12} className="mt-3 mt-md-0">
              <Stack spacing={10}>
                <MdLocationOn size={20} />
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Xem vị trí trên Google Maps
                </a>
              </Stack>
              <p className="mt-2">
                Giờ mở cửa: 9:00 - 21:00 (Thứ 2 - Chủ nhật)
              </p>
            </Col>
          </Row>
        </Panel>
      </Panel>
    );
  }