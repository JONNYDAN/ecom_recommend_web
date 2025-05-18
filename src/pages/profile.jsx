import PageContainer from "@/components/common/PageContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button, Col, Form, InputGroup, Nav, Row, Schema, Table, DatePicker, Pagination, FlexboxGrid, Divider, Avatar, Grid  } from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { MdVpnKey, MdPerson, MdShoppingCart } from "react-icons/md";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAvatarCharacter } from "@/utils/stringUtils";
import { authService } from "@/services";
import useMessage from "@/hooks/useMessage";
import useToggle from "@/hooks/useToggle";
import { useScreenSize } from "@/contexts/ScreenSizeContext";
import VerifyEmailSection from "@/components/verify-email/VerifyEmailSection";
import clsx from "clsx";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";
import { useRouter } from 'next/router';

const { StringType } = Schema.Types;

const { Column, HeaderCell, Cell } = Table;

const passwordFormModel = Schema.Model({
  currentPassword: StringType().isRequired("This field is required."),
  newPassword: StringType()
    .minLength(8, "Minimum 8 characters required")
    .containsUppercaseLetter("Must contain uppercase characters")
    .containsLowercaseLetter("Must contain lowercase English characters")
    .isRequired("This field is required."),
  confirmPassword: StringType()
    .addRule((value, data) => {
      if (value !== data.newPassword) {
        return false;
      }
      return true;
    }, "The two passwords do not match")
    .isRequired("This field is required."),
});

const userInfoFormModel = Schema.Model({
  name: StringType()
    .maxLength(30, "The maximum is only 30 characters.")
    .isRequired("This field is required."),
  phone: StringType().pattern(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    "Must be a valid phone number"
  ),
  job_title: StringType().maxLength(50, "The maximum is only 50 characters."),
  address: StringType().maxLength(200, "The maximum is only 200 characters."),
});

const TABS = {
  USER_INFO: "USER_INFO",
  ORDER_HISTORY: "ORDER_HISTORY",
  CHANGE_PWD: "CHANGE_PWD",
};

const defaultPasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export async function getServerSideProps({ req, locale, query }) {
  
  const user = await authService.getUserInfo({
    headers: req.headers,
  });

  const page = parseInt(query.page) || 1;

  // const order_user = await authService.getUserOrders({
  //   headers: req.headers,
  // }, page, 10);
  
  let order_user = []
  const translation = await serverSideTranslations(
    locale,
    combineListLocales("home", localeItems.profile)
  );
  console.log(user)
  if (!user?._id) {
    return {
      redirect: {
        destination: "/authen/sign-in",
      },
    };
  }

  return {
    props: { ...translation, user, order_user },
  };
}

function ProfilePage({ user, order_user}) {

  const { t: tProfile } = useLocale(localeItems.profile);
  const [visibleCurrentPassword, toggleVisibleCurrentPassword] =
    useToggle(false);
  const [visibleNewPassword, toggleVisibleNewPassword] = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.USER_INFO);

  const formRef = useRef(null);
  const [passowrdFormValue, setPasswordFormValue] = useState(
    defaultPasswordFormValues
  );

  const [userInfoFormValue, setUserInfoFormValue] = useState({
    name: user.name,
    phone: user.phone,
    job_title: user.job_title,
    address: user.address,
  });

  const { showToast } = useMessage();
  const screenSize = useScreenSize();

  const handleUpdateProfile = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const status = await authService.updateUserInfo(userInfoFormValue);
    setIsLoading(false);

    if (status) {
      showToast("Your information is updated");
    } else {
      showToast("Some errors occured!", { type: "error" });
    }
  };

  const handleUpdatePassword = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const status = await authService.changePassword(passowrdFormValue);
    setIsLoading(false);

    if (status) {
      showToast("Your password is updated");
      // reset state
      setPasswordFormValue(defaultPasswordFormValues);
    } else {
      showToast("Some errors occured!", { type: "error" });
    }
  };

  const handleFormSubmit = () => {
    if (activeTab === TABS.USER_INFO) {
      handleUpdateProfile();
    } else {
      handleUpdatePassword();
    }
  };

  const renderFormAction = () => (
    <div className="d-flex justify-content-between">
      <Button
        onClick={handleFormSubmit}
        appearance="primary"
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        {tProfile("update")}
      </Button>
    </div>
  );

  const renderUserInforForm = () => (
    <div
    className="bg-white" 
    style={{boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px', borderRadius: 10, padding: 30}}
    >
      {/* {!user.active && <VerifyEmailSection email={user.email} />} */}

      <h4>{tProfile("overview")}</h4>

      <Grid fluid className="pb-3 pt-2">
        <Row className="show-grid ">
          <Col xs={24} sm={24} md={6}>
            <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("full_name")}
              </div>
              <div className="col-5">
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {user.name || <span style={{ color: 'red' }}>Chưa cập nhật</span>}
                </p>
              </div>
            </div>
            <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("job_title")}
              </div>
              <div className="col-5">
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {user.job_title || <span style={{ color: 'red' }}>Chưa cập nhật</span>}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("email")}
              </div>
              <div className="col-5">
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {user.email || <span style={{ color: 'red', fontWeight: 'bold' }}>Chưa cập nhật</span>}
                </p>
              </div>
            </div>
            <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("address")}
              </div>
              <div className="flex-grow"> 
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {user.address || <span style={{ color: 'red'}}>Chưa cập nhật</span>}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("phone")}
              </div>
              <div className="flex-grow">
                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {user.phone || <span style={{ color: 'red'}}>Chưa cập nhật</span>}
                </p>
              </div>
            </div>
            {/* <div className="d-flex d-md-block pb-2">
              <div className="col-6">
                {tProfile("date_of_joining")}
              </div>
              <div className="col-5">
                <p style={{ fontWeight: 'bold', fontSize: '13px', color: 'red' }}>
                  {user.date_of_joining}
                </p>
              </div>
            </div> */}
          </Col>
        </Row>
      </Grid>


      <hr></hr>
      <Row className="show-grid d-flex align-items-center pt-3 pb-3">
        <Col xs={24} sm={24} md={6}>
          <div className="d-flex justify-content-center">
            <Avatar circle className="me-2" style={{ background: "#111", width:"6em", height:"6em" }}>
              {getAvatarCharacter(user.name)}
            </Avatar>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12}>
            <div style={{"marginLeft": "20px"}}>
            <Button appearance="ghost" active>
              {tProfile("update_avatar")}
            </Button>
            <div className="mt-2">
              <h6 style={{ fontSize: '14px', color: 'gray' }}>{tProfile("please_select_an_image_smaller_than_5mb")}</h6>
            </div>
            <div>
              <h6 style={{ fontSize: '14px', color: 'gray' }}>{tProfile("choose_an_appropriate,_non-offensive_image")}</h6>
            </div>
          </div>
        </Col>
      </Row>

      
      <hr></hr>
      <h4>{tProfile("my_information")}</h4>
      <p style={{paddingBottom: 10}}>{tProfile("update_information.")}</p>

      <Form
        className="mt-2"
        ref={formRef}
        model={userInfoFormModel}
        onChange={setUserInfoFormValue}
        formValue={userInfoFormValue}
        fluid
      >
        <Row>
          <Col xs={24} lg={12} className="mb-3">
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="user-email"
                type="email"
                defaultValue={user.email}
                disabled
              />
            </Form.Group>
          </Col>
          <Col xs={24} lg={12} className="mb-3">
            <Form.Group>
              <Form.ControlLabel>{tProfile("full_name")}</Form.ControlLabel>
              <Form.Control
                name="full_name"
                type="text"
                placeholder={tProfile("enter_your_name")}
              />
            </Form.Group>
          </Col>
          <Col xs={24} lg={12} className="mb-3">
            <Form.Group>
              <Form.ControlLabel>{tProfile("phone")}</Form.ControlLabel>
              <Form.Control
                name="phone"
                type="text"
                placeholder={tProfile("phone_number")}
              />
            </Form.Group>
          </Col>
          <Col xs={24} lg={12} className="mb-3">
            <Form.Group>
              <Form.ControlLabel>{tProfile("job_title")}</Form.ControlLabel>
              <Form.Control
                name="job_title"
                type="text"
                placeholder="Ex: Software Engineer"
              />
            </Form.Group>
          </Col>
          <Col xs={24} className="mb-3">
            <Form.Group>
              <Form.ControlLabel>{tProfile("address")}</Form.ControlLabel>
              <Form.Control name="address" type="text" placeholder={tProfile("address")} />
            </Form.Group>
          </Col>
        </Row>

        {renderFormAction()}
      </Form>
    </div>
  );

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const router = useRouter();
  const [orders, setOrders] = useState(order_user.data);
  const [activePage, setActivePage] = useState(parseInt(router.query.page) || 1);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     const newOrders = await authService.getUserOrders({
  //       headers: {},
  //     }, activePage, 10);
  //     setOrders(newOrders.data);
  //   };

  //   fetchOrders();
  // }, [activePage]);

  const handlePageChange = (newPage) => {
    setActivePage(newPage);
  };

  const renderOrderHistoryForm = () => {
    return(
      <div
          className="bg-white" 
          style={{boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px', borderRadius: 5, padding: 30}}
          >
        <h4>{tProfile("my_order_history")}</h4>
        <p style={{paddingBottom: 10}}>{tProfile("display_information_about_the_products_you_have_purchased_at_x-mentor_shop.")}</p>
        <hr></hr>
        {/* {!user.active && <VerifyEmailSection email={user.email} />} */}
        <Form
          className="mt-2"
          ref={formRef}
          model={userInfoFormModel}
          onChange={setUserInfoFormValue}
          formValue={userInfoFormValue}
          fluid
        >
          <Table
            height={400}
            data={orders}
          >
            <Column align="center" width={150}>
              <HeaderCell style={{ fontSize: 18, fontWeight: 500}}>{tProfile("create_at")}</HeaderCell>
              <Cell dataKey="created_at">
                {rowData => formatDate(rowData.created_at)}
              </Cell>
            </Column>

            <Column align="center" width={130}>
              <HeaderCell style={{ fontSize: 18, fontWeight: 500}}>{tProfile("order_code")}</HeaderCell>
              <Cell dataKey="code" />
            </Column>

            <Column width={300}>
              <HeaderCell style={{ fontSize: 18, fontWeight: 500}}>{tProfile("product")}</HeaderCell>
              <Cell dataKey="items[0].product_name" />
            </Column>

            <Column align="center" width={100}>
              <HeaderCell style={{ fontSize: 18, fontWeight: 500}}>{tProfile("total_amount")}</HeaderCell>
              <Cell dataKey="total_amount" />
            </Column>

            <Column align="center" width={100}>
              <HeaderCell style={{ fontSize: 18, fontWeight: 500}}>{tProfile("status")}</HeaderCell>
              <Cell dataKey="status" style={{color: '#50C878'}} />
            </Column>
          </Table>
          <div style={{display: 'flex', justifyContent: 'center', paddingTop: 10}}>
          <Pagination
              prev
              last
              next
              first
              size="xs"
              total={order_user.total_page}
              limit={1}
              activePage={activePage}
              onChangePage={handlePageChange}
            />
          </div>
        </Form>
      </div>
    );
  };

  const renderPasswordForm = () => (
    <div
    className="bg-white" 
    style={{boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px', borderRadius: 10, padding: 30}}
    >
      <h4>{tProfile("update_password")}</h4>
      <p style={{paddingBottom: 10}}>{tProfile("for_safety,_x-mentor_shop_encourages_customers_to_use_strong_passwords.")}</p>
      <hr></hr>
      <Row className="show-grid "> 
        <Form
          className="mt-2"
          ref={formRef}
          model={passwordFormModel}
          onChange={setPasswordFormValue}
          formValue={passowrdFormValue}
          fluid={screenSize.isSmallerThan.md}
        >
          <div className="form-change-pass gap-2">
            <Col xs={24} sm={24} md={12} >

              <Form.Group>
                <InputGroup inside>
                  <Form.Control
                    name="currentPassword"
                    type={visibleCurrentPassword ? "text" : "password"}
                    autoComplete="off"
                    placeholder={tProfile("current_password")}
                  />
                  <InputGroup.Button onClick={toggleVisibleCurrentPassword}>
                    {visibleCurrentPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </InputGroup.Button>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup inside>
                  <Form.Control
                    name="newPassword"
                    type={visibleNewPassword ? "text" : "password"}
                    autoComplete="off"
                    placeholder={tProfile("new_password")}
                  />
                  <InputGroup.Button onClick={toggleVisibleNewPassword}>
                    {visibleNewPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </InputGroup.Button>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  name="confirmPassword"
                  type={visibleNewPassword ? "text" : "password"}
                  placeholder={tProfile("confirm_password")}
                />
              </Form.Group>
              <Form.Group>{renderFormAction()}</Form.Group>

            </Col>
            {screenSize.isGreaterThan.lg && <Divider className="mt-2 mb-0" style={{height:"10em"}} vertical />}
            <Col xs={24} sm={24} md={12} style={{padding: '20px'}}>
              <h6 style={{ fontWeight: 'bold' }}>{tProfile("your_password")}</h6>
              <h6 style={{ fontSize: '15px', color: 'gray', paddingTop: '10px' }}>{tProfile("must_be_at_least_8_characters_long.")}</h6>
              <h6 style={{ fontSize: '15px', color: 'gray' }}>{tProfile("it_should_contain_at_least_1_number_or_1_special_character.")}</h6>
              <h6 style={{ fontSize: '15px', color: 'gray' }}>{tProfile("should_not_be_similar_to_recently_used_passwords.")}</h6>
            </Col>
          </div>
        </Form>
      </Row>
    </div>
  );

  const renderTab = () => {
    const tabsMap = {
      [TABS.USER_INFO]: renderUserInforForm,
      [TABS.CHANGE_PWD]: renderPasswordForm,
      [TABS.ORDER_HISTORY]: renderOrderHistoryForm,
    };

    return tabsMap[activeTab]();
  };

  return (
    <PageContainer
      className="bg-light"
    >
      <PageContainer
        metaData={{ title: tProfile("meta_title") }}
        className="my-3 my-lg-5 container"
      >
        <Row>
          <Col xs={24} md={24} lg={6} className="mb-3 mt-4">
            <Nav
              activeKey={activeTab}
              onSelect={setActiveTab}
              appearance="subtle"
              vertical={screenSize.isGreaterThan.sm}
              reversed
              style={{ boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px', borderRadius: 10 }}
              className="bg-white d-flex d-md-block justify-content-around"  // Thay đổi ở đây
              >
              <Nav.Item
                eventKey={TABS.USER_INFO}
                className={clsx({ "bg-light": activeTab === TABS.USER_INFO })}
                icon={<MdPerson />}
                style={{ flex: '1 1 0%' }}
              >
                <span className="nav-text">{tProfile("account_information")}</span>
              </Nav.Item>
              <Nav.Item
                eventKey={TABS.CHANGE_PWD}
                className={clsx({ "bg-light": activeTab === TABS.CHANGE_PWD })}
                icon={<MdVpnKey />}
                style={{ flex: '1 1 0%' }}
              >
                <span className="nav-text">{tProfile("change_password")}</span>
              </Nav.Item>
              <Nav.Item
                eventKey={TABS.ORDER_HISTORY}
                className={clsx({ "bg-light": activeTab === TABS.ORDER_HISTORY })}
                icon={<MdShoppingCart />}
                style={{ flex: '1 1 0%' }}
              >
                <span className="nav-text">{tProfile("order_history")}</span>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={24} md={24} lg={18}>
            <div className="px-md-3 mt-4 mb-4">{renderTab()}</div>
          </Col>
        </Row>
      </PageContainer>
    </PageContainer>
  );
}

export default ProfilePage;
