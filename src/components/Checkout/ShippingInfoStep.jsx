import React, { useState, useEffect, useRef } from 'react';
import { Form, ButtonToolbar, Button, Schema, Input, SelectPicker, Message } from 'rsuite';
import { MdArrowForward } from 'react-icons/md';
import { locationService } from '../../services/locationService';

const { StringType } = Schema.Types;

// Define validation model
const model = Schema.Model({
  fullName: StringType().isRequired('Vui lòng nhập họ tên'),
  phone: StringType()
    .isRequired('Vui lòng nhập số điện thoại')
    .pattern(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  email: StringType()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ'),
  address: StringType().isRequired('Vui lòng nhập địa chỉ'),
  city: StringType().isRequired('Vui lòng chọn tỉnh/thành phố'),
  district: StringType().isRequired('Vui lòng chọn quận/huyện'),
  ward: StringType().isRequired('Vui lòng chọn phường/xã'),
});

const ShippingInfoStep = ({ onSubmit, initialValues = {} }) => {
  const formRef = useRef();  
  const [formValue, setFormValue] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    cityCode: '',  // Store province code for API calls
    districtCode: '', // Store district code for API calls
    wardCode: '', // Store ward code for API calls
    ...initialValues
  });
  
  const [formError, setFormError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      setLocationError(null);
      
      const result = await locationService.getProvinces();
      setIsLoadingProvinces(false);
      
      if (result.success) {
        setProvinces(result.data);
      } else {
        setLocationError('Không thể tải danh sách tỉnh/thành phố');
        console.error('Failed to load provinces:', result.error);
      }
    };
    
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formValue.cityCode) {
        setDistricts([]);
        return;
      }
      
      setIsLoadingDistricts(true);
      setLocationError(null);
      
      const result = await locationService.getProvinceWithDistricts(formValue.cityCode);
      setIsLoadingDistricts(false);
      
      if (result.success && result.data && result.data.districts) {
        setDistricts(result.data.districts);
      } else {
        setDistricts([]);
        setLocationError('Không thể tải danh sách quận/huyện');
        console.error('Failed to load districts:', result.error);
      }
    };
    
    fetchDistricts();
  }, [formValue.cityCode]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formValue.districtCode) {
        setWards([]);
        return;
      }
      
      setIsLoadingWards(true);
      setLocationError(null);
      
      const result = await locationService.getDistrictWithWards(formValue.districtCode);
      setIsLoadingWards(false);
      
      if (result.success && result.data && result.data.wards) {
        setWards(result.data.wards);
      } else {
        setWards([]);
        setLocationError('Không thể tải danh sách phường/xã');
        console.error('Failed to load wards:', result.error);
      }
    };
    
    fetchWards();
  }, [formValue.districtCode]);

  const handleSubmit = async () => {
    console.log('Submitting form...');
    if (isSubmitting) {
      console.log('Form is already submitting');
      return;
    }
    
    setIsSubmitting(true);
    if (formRef.current) {
      console.log('Form ref is available');
      const valid = await formRef.current.checkAsync();
      
      if (!valid.hasError) {
        console.log('Form is valid:', formValue);
        await onSubmit(formValue);
      } else {
        // Set form errors to display on UI
        console.log('Form is invalid:', valid);
        setFormError(valid.formError || {});
        
        // Force check to show validation errors
        formRef.current.check();
      }
      setIsSubmitting(false);
    } else {
      console.error('Form ref is not available');
      setIsSubmitting(false);
    }
  };

  // Handle province selection
  const handleProvinceChange = (value) => {
    if (value) {
      // Find the selected province object by code
      const selectedProvince = provinces.find(p => p.code === value);
      console.log('Province selected:', selectedProvince);
      
      if (selectedProvince) {
        // Update form with both code (for API) and name (for validation)
        setFormValue(prev => ({
          ...prev,
          city: selectedProvince.name, // Store name for form validation
          cityCode: value, // Store code for API calls
          district: '',
          districtCode: '',
          ward: '',
          wardCode: ''
        }));
        formRef.current.cleanErrorForField('city');
      }
    }
  };

  // Handle district selection
  const handleDistrictChange = (value) => {
    if (value) {
      // Find the selected district object by code
      const selectedDistrict = districts.find(d => d.code === value);
      console.log('District selected:', selectedDistrict);
      
      if (selectedDistrict) {
        // Update form with both code (for API) and name (for validation)
        setFormValue(prev => ({
          ...prev,
          district: selectedDistrict.name, // Store name for form validation
          districtCode: value, // Store code for API calls
          ward: '',
          wardCode: ''
        }));
        formRef.current.cleanErrorForField('district');
      }
    }
  };

  // Handle ward selection
  const handleWardChange = (value) => {
    if (value) {
      // Find the selected ward object by code
      const selectedWard = wards.find(w => w.code === value);
      console.log('Ward selected:', selectedWard);
      
      if (selectedWard) {
        // Update form with both code (for API) and name (for validation)
        setFormValue(prev => ({
          ...prev,
          ward: selectedWard.name, // Store name for form validation
          wardCode: value // Store code for API calls
        }));
        formRef.current.cleanErrorForField('ward');
      }
    }
  };

  return (
    <div>
      <h4 className="mb-4">Thông tin giao hàng</h4>
      
      {locationError && (
        <Message type="error" className="mb-4">
          {locationError}
        </Message>
      )}
      
      <Form
        ref={formRef}
        fluid
        model={model}
        formValue={formValue}
        onChange={setFormValue}
        onCheck={setFormError}
        className="mb-4"
      >
        <Form.Group className="mb-3">
          <Form.ControlLabel>Họ tên người nhận <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control name="fullName" placeholder='Nhập họ tên' />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Số điện thoại <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control name="phone" placeholder='Nhập số điện thoại' />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" placeholder='Nhập email' />
          <Form.HelpText>Không bắt buộc, dùng để gửi thông tin đơn hàng</Form.HelpText>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Tỉnh/Thành phố <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control
            name="city"
            accepter={() => <SelectPicker 
              block
              value={formValue.cityCode}
              onChange={handleProvinceChange}
              data={provinces.map(province => ({
                label: province.name,
                value: province.code
              }))}
              placeholder="Chọn tỉnh/thành phố"
              loading={isLoadingProvinces}
              cleanable={false}
              searchable={true}
            />}
            
          />
          {formError.city && <Form.ErrorMessage>{formError.city}</Form.ErrorMessage>}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Quận/Huyện <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control
            name="district"
            accepter={SelectPicker}
            block
            value={formValue.districtCode}
            onChange={handleDistrictChange}
            data={districts.map(district => ({
              label: district.name,
              value: district.code
            }))}
            placeholder="Chọn quận/huyện"
            loading={isLoadingDistricts}
            disabled={!formValue.cityCode || isLoadingDistricts}
            cleanable={false}
            searchable={true}
          />
          {formError.district && <Form.ErrorMessage>{formError.district}</Form.ErrorMessage>}
          {isLoadingDistricts && <Form.HelpText>Đang tải quận/huyện...</Form.HelpText>}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Phường/Xã <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control
            name="ward"
            accepter={SelectPicker}
            block
            value={formValue.wardCode}
            onChange={handleWardChange}
            data={wards.map(ward => ({
              label: ward.name,
              value: ward.code
            }))}
            placeholder="Chọn phường/xã"
            loading={isLoadingWards}
            disabled={!formValue.districtCode || isLoadingWards}
            cleanable={false}
            searchable={true}
          />
          {formError.ward && <Form.ErrorMessage>{formError.ward}</Form.ErrorMessage>}
          {isLoadingWards && <Form.HelpText>Đang tải phường/xã...</Form.HelpText>}
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.ControlLabel>Địa chỉ <span className="text-danger">*</span></Form.ControlLabel>
          <Form.Control name="address" placeholder='Nhập địa chỉ' />
          <Form.HelpText>Số nhà, tên đường</Form.HelpText>
        </Form.Group>
        
        <ButtonToolbar className="mt-4 d-flex justify-content-end">
          <Button 
            appearance="primary" 
            color="black" 
            size="lg" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
            className="d-flex align-items-center"
          >
            Tiếp tục chọn phương thức vận chuyển <MdArrowForward className="ms-2" />
          </Button>
        </ButtonToolbar>
      </Form>
    </div>
  );
};

export default ShippingInfoStep;
