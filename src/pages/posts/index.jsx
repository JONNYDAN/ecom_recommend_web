import PageContainer from "@/components/common/PageContainer";
import { postService } from "@/services";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, Placeholder, Loader, Message, Content, Input } from "rsuite";
import useSWR from "swr";
import { combineListLocales } from "@/config/localeConfig";
import Breadcrumb, { breadcrumbItems } from "@/components/Navigation/Breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import PostCard from "@/components/post/PostCard";

const breadcrumbs = [
  {
    name: breadcrumbItems.home,
    url: "/",
    isActive: false,
  },
  {
    name: breadcrumbItems.posts,
    url: "/posts",
    isActive: true,
  },
];

function formatQuery(searchTerm = "", categoryTerm = "") {
  const query = {};
  if (searchTerm) query.search = searchTerm;
  if (categoryTerm) query.category = categoryTerm;
  return query;
}

export async function getServerSideProps({ query, locale }) {
  try {
    const searchTerm = query?.search || "";
    const categoryTerm = query?.category || "";
    const response = await postService.getListPost(formatQuery(searchTerm, categoryTerm));
    
    return {
      props: {
        query,
        postList: { data: response?.data || [] },
        ...(await serverSideTranslations(locale, combineListLocales("home", "ourWork"))),
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return {
      props: {
        query,
        postList: { data: [] },
        ...(await serverSideTranslations(locale, combineListLocales("home", "ourWork"))),
      },
    };
  }
}

function PostList({ query, postList }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query?.search || "");
  const categoryTerm = query?.category || "";

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      router.push({
        pathname: "/posts",
        query: { 
          ...(categoryTerm && { category: categoryTerm }),
          ...(searchTerm && { search: searchTerm })
        },
      });
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, categoryTerm]);

  const {
    data: responseData,
    error: postListError,
    isLoading: postListIsLoading,
  } = useSWR(["postList", searchTerm, categoryTerm], () => 
    postService.getListPost(formatQuery(searchTerm, categoryTerm))
  );  

  const posts = responseData?.data || postList?.data || [];

  const metaData = {
    title: "Danh sách bài viết",
    ogTypeArticle: true,
    description: "Danh sách các bài viết mới nhất",
    isFollow: true,
  };

  const renderPostList = () => {
    if (postListIsLoading) {
      return (
        <div>
          <Placeholder.Paragraph rows={5} />
          <Loader backdrop content="loading..." vertical />
        </div>
      );
    }

    if (postListError) {
      return (
        <Message showIcon type="error" header="Error">
          Đã xảy ra lỗi khi tải danh sách bài viết. Vui lòng thử lại sau.
        </Message>
      );
    } 
    console.log(postList);

    if (!posts?.length) {
      return (
        <Message showIcon type="info" header="Không có kết quả">
          Không tìm thấy bài viết nào phù hợp.
        </Message>
      );
    }

    return (
      <div className="source-list-grid" style={{gap: "100px"}}>
        {posts.map((item) => (
          <PostCard key={item.id} {...item} />
        ))}
      </div>
    );
  };

  return (
    <PageContainer metaData={metaData}>
      <div className="bg-gradient-1 py-5 d-flex justify-content-center align-items-center flex-wrap gap-4">
        <div className="my-5 d-flex justify-content-center flex-column align-items-center text-uppercase text-light">
          <div className="display-4">BAOOStore JSC</div>
          <div>{"Your future's navigator"}</div>
        </div>
        <Image
          src="/images/about-us/key-success.svg"
          width={180}
          height={180}
          alt="Mission"
          style={{
            width: "auto",
          }}
        />
      </div>

      <div className="container my-4">
        <Breadcrumb items={breadcrumbs} />

        {/* Input tìm kiếm */}
        <div className="d-flex mb-3">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Nhập từ khóa tìm kiếm..."
            style={{ maxWidth: "300px" }}
          />
        </div>

        <Row className="">
          <Col sm={24}>
            <h1>Danh sách bài viết</h1>
          </Col>
        </Row>

        <Content className="container mt-3 mb-5">
          <Row className="d-flex justify-content-center" >
            <Col xs={24} md={24} lg={24}>
              <div className="ps-lg-3">{renderPostList()}</div>
            </Col>
          </Row>
        </Content>
      </div>
    </PageContainer>
  );
}

export default PostList;