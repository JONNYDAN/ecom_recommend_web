import React, { useState, useEffect } from "react";
import { Container, Row, Col, Panel, Button, Loader, Message } from "rsuite";
import { MdArrowForward } from "react-icons/md";
import { useRouter } from "next/router";
import { postService } from "@/services";

function FashionNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Navigation handler to post detail page
  const navigateToPost = (postId) => {
    router.push(`/vi/posts/${postId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getListPost()

        setPosts(data.data);

      } catch (err) {
        setError('Error loading news: ' + err.message);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date from ISO string to readable format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `Ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <section>
        <Container className="fashion-news-section mb-4">
          <h2 className="text-center fw-bold mb-4">TIN TỨC THỜI TRANG</h2>
          <div className="text-center py-5">
            <Loader size="lg" content="Đang tải tin tức..." vertical />
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <Container className="fashion-news-section mb-4">
          <h2 className="text-center fw-bold mb-4">TIN TỨC THỜI TRANG</h2>
          <Message type="error" header="Lỗi" className="mx-auto" style={{ maxWidth: '600px' }}>
            {error}
          </Message>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <Container className="fashion-news-section mb-4">
          <h2 className="text-center fw-bold mb-4">TIN TỨC THỜI TRANG</h2>

          {/* Mobile View (Featured + 2 smaller) */}
          <div className="d-md-none">
            <Row>
              {/* Featured news item */}
              {posts.length > 0 && (
                <Col xs={24}>
                  <Panel
                    className="news-item featured-news mb-3 cursor-pointer"
                    shaded
                    onClick={() => navigateToPost(posts[0]._id)}
                  >
                    <div className="news-img-container">
                      <img
                        src={posts[0].thumbnail}
                        alt={posts[0].title}
                        className="img-fluid rounded w-100"
                      />
                    </div>
                    <div className="news-content p-3">
                      <small className="text-muted d-block mb-2">
                        {formatDate(posts[0].createdAt)}
                      </small>
                      <h5 className="mb-2">{posts[0].title}</h5>
                      <p className="news-description mb-2">{posts[0].description}</p>
                      <Button
                        appearance="link"
                        className="read-more p-0"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent double navigation
                          navigateToPost(posts[0]._id);
                        }}
                      >
                        Xem thêm <MdArrowForward />
                      </Button>
                    </div>
                  </Panel>
                </Col>
              )}

              {/* Smaller news items */}
              {posts.length > 1 && (
                <Col xs={12}>
                  <Panel
                    className="news-item small-news mb-3 me-1 cursor-pointer"
                    shaded
                    onClick={() => navigateToPost(posts[1]._id)}
                  >
                    <div className="news-img-container">
                      <img
                        src={posts[1].thumbnail}
                        alt={posts[1].title}
                        className="img-fluid rounded w-100"
                      />
                    </div>
                    <div className="news-content p-2">
                      <small className="text-muted d-block mb-1">
                        {formatDate(posts[1].createdAt)}
                      </small>
                      <h6 className="mb-1">{posts[1].title}</h6>
                      <Button
                        appearance="link"
                        className="read-more p-0 small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPost(posts[1]._id);
                        }}
                      >
                        Xem thêm <MdArrowForward />
                      </Button>
                    </div>
                  </Panel>
                </Col>
              )}

              {posts.length > 2 && (
                <Col xs={12}>
                  <Panel
                    className="news-item small-news mb-3 ms-1 cursor-pointer"
                    shaded
                    onClick={() => navigateToPost(posts[2]._id)}
                  >
                    <div className="news-img-container">
                      <img
                        src={posts[2].thumbnail}
                        alt={posts[2].title}
                        className="img-fluid rounded w-100"
                      />
                    </div>
                    <div className="news-content p-2">
                      <small className="text-muted d-block mb-1">
                        {formatDate(posts[2].createdAt)}
                      </small>
                      <h6 className="mb-1">{posts[2].title}</h6>
                      <Button
                        appearance="link"
                        className="read-more p-0 small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPost(posts[2]._id);
                        }}
                      >
                        Xem thêm <MdArrowForward />
                      </Button>
                    </div>
                  </Panel>
                </Col>
              )}
            </Row>
          </div>

          {/* Desktop/Tablet View (3 equal items) */}
          <div className="d-none d-md-block">
            <Row>
              {posts.map((post) => (
                <Col md={8} key={post._id}>
                  <Panel
                    className="news-item h-100 mx-2 cursor-pointer"
                    shaded
                    onClick={() => navigateToPost(post._id)}
                  >
                    <div className="news-img-container">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="img-fluid rounded w-100"
                      />
                    </div>
                    <div className="news-content p-3">
                      <small className="text-muted d-block mb-2">
                        {formatDate(post.createdAt)}
                      </small>
                      <h5 className="mb-2">{post.title}</h5>
                      <p className="news-description mb-2">{post.description}</p>
                      <Button
                        appearance="link"
                        className="read-more p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPost(post._id);
                        }}
                      >
                        Xem thêm <MdArrowForward />
                      </Button>
                    </div>
                  </Panel>
                </Col>
              ))}
            </Row>
          </div>

          <style jsx>{`
          .fashion-news-section {
            margin-bottom: 3rem;
          }
          .news-item {
            transition: all 0.3s ease;
          }
          .news-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .news-description {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .read-more {
            color: #007BFF;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          .featured-news .news-img-container {
            max-height: 200px;
            overflow: hidden;
          }
          .small-news .news-img-container {
            max-height: 120px;
            overflow: hidden;
          }
          .cursor-pointer {
            cursor: pointer;
          }
        `}</style>
        </Container>
      </div>
    </section>
  );
}

export default FashionNews;