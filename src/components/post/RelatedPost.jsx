import SafeImage from "@/components/common/SafeImage";
import { Panel } from "rsuite";
import SmartCarousel from "../common/SmartCarousel";
import NavLink from "../Navigation/NavLink";

const renderRelatedPost = (postList=[]) => {
  
  return (
    <SmartCarousel className="my-post-container">
      {postList.map((p) => (
        <div className="card-carousel-item my-post-list" key={p.id}>
          <NavLink
            className="text-color-inherit text-decoration-none"
            href={`/posts/${p.slug}`}>
            <Panel
              key={p.id}
              shaded
              bordered
              bodyFill
              className="card-items"
              href={`/posts/${p.slug}`}
            >
              <SafeImage
                height="270"
                width="480"
                alt={p.title}
                src={p.thumbnail}
                className="my-post-thumbnail"
              />
              <div className="p-2 mt-2">
                <span>
                  <b>{p.title}</b>
                </span>
                <p className="mt-2" style={{ fontSize: 12 }}>
                  {p.description}
                </p>
              </div>
            </Panel>
          </NavLink>
        </div>
      ))}
    </SmartCarousel>
  );
};

function RelatedPost({posts}) {
  return (
    <div className="related-post">
      <div className="container">
        <h3 className="text-center pt-4">BÀI VIẾT CÙNG CHỦ ĐỀ</h3>
        {renderRelatedPost(posts)}
      </div>
    </div>
  );
}

export default RelatedPost;
