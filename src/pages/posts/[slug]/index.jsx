import PageContainer from "@/components/common/PageContainer";
import { postService } from "@/services";
import Image from "next/image";
import { useRouter } from "next/router";
import { Col, Row } from "rsuite";

import { combineListLocales } from "@/config/localeConfig";
import Breadcrumb, {
  breadcrumbItems,
} from "@/components/Navigation/Breadcrumb";
import { locale } from "@/config/localeConfig";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { useMemo } from "react";
import { Nav } from "rsuite";
import { useScreenSize } from "@/contexts/ScreenSizeContext";
import RelatedPost from "@/components/post/RelatedPost";
const breadcrumbs = [
  {
    name: breadcrumbItems.home,
    url: "/",
    isActive: false,
  },
  {
    name: breadcrumbItems.posts,
    url: "/posts",
    isActive: false,
  },
];

export async function getServerSideProps({ params, locale }) {
  const post = await postService.getPostBySlug(params.slug);

  const relatedPost = await postService.getRelatedPost(params.slug);

  const translation = await serverSideTranslations(
    locale,
    combineListLocales("home", "ourWork")
  );

  return {
    props: {
      post,
	  relatedPost: relatedPost.data,
      ...translation,
    },
  };
}

function PostDetail({ post, relatedPost, locale }) {
  const router = useRouter();
  if (!post) {
    router.replace("/404");
  }

  const metaData = {
    title: `${post.title}`,
    ogTypeArticle: true,
    description: post.description,
    isFollow: true,
  };
  const { isMobile } = useScreenSize();
  const screenSize = useScreenSize();
  // const [activeTab, setActiveTab] = useState(post.menu[0].id);
  const breadcrumbItems = useMemo(
    () => [
      ...breadcrumbs,
        {
          name: post.title,
          isActive: true,
        },
    ],
    [post.title]
  );

  // const renderMenu = (menus) => {
  //   const handleMenuClick = (menuId) => {
  //     // Set the active tab
  //     // setActiveTab(menuId);
  
  //     // Scroll to the element with the corresponding id
  //     const element = document.getElementById(menuId);
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   };

  //   return (
  //     <div>
  //       <div className="mx-2 my-3">
  //               <b>Nội dung</b>
  //             </div> 
  //       <Nav
  //         activeKey={activeTab}
  //         onSelect={handleMenuClick}
  //         appearance="subtle"
  //         vertical={screenSize.isGreaterThan.sm}
  //         reversed
  //         style={{ borderRight: "2px solid #7c0fd1" }}
  //         className="d-flex d-md-block justify-content-around" // Thay đổi ở đây
  //       >
  //         {/* for list menu and create tab */}
  //         {menus.map((menu) => (
  //           <Nav.Item
  //             key={menu.id}
  //             eventKey={menu.id}
  //             className={`d-flex align-items-center ${menu.id === activeTab ? "custom-active-nav-item" : ""}`}
  //             onClick={() => handleMenuClick(menu.id)}
  //           >
  //             {menu.icon}
  //             <span className="ml-2" style={{ fontSize: 14, fontWeight: 500 }}>
  //               {menu.title}
  //             </span>
  //           </Nav.Item>
  //         ))}
  //       </Nav>
  //     </div>
  //   );
  // };

  return (
    <PageContainer
      metaData={metaData}>
      <div className="bg-gradient-1 py-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div className="my-5 d-flex justify-content-center flex-column align-items-center text-uppercase text-light">
          <div className="display-4">BAOOStore JSC</div>
          <div>{"Your future's navigator"}</div>
        </div>
        <Image
          src="/images/about-us/key-success.svg"
          width={360}
          height={360}
          alt="Mission"
          style={{
            width: "auto",
          }}
        />
        <div></div>
      </div>

      <div className="container my-4">
        <Breadcrumb items={breadcrumbItems} />

        {/* TITLE */}
        <Row className="">
          <Col sm={24} md={18}>
            <h1>{post.title.toUpperCase()}</h1>
            <div>
              <i>
                Viết bởi: admin | {post.created_at}
              </i>
            </div>
          </Col>
        </Row>

        {/*CONTENT + MENU   */}
        <Row className="mt-5">
          <Col sm={24} md={18}>
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Col>
          {/* <Col sm={24} md={6}>
          {!isMobile && (
            
            renderMenu(post.menu)
          )}
         
          </Col> */}
        </Row>
      </div>

      <RelatedPost posts={relatedPost}></RelatedPost>
    </PageContainer>
  );
}

export default PostDetail;
