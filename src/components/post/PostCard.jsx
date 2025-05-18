import { useMemo } from "react";
import { useRouter } from "next/router";
import { Tag } from "rsuite";

import { getRawText } from "@/utils/stringUtils";
import NavLink from "../Navigation/NavLink";
import SafeImage from "../common/SafeImage";
import TextTruncated from "../common/TextTruncated";

import TouchIcon from '@rsuite/icons/Touch';
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function PostCard({
  _id,
  title,
  description,
  thumbnail,
  createdAt
}) {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi });
  const rawDescription = getRawText(description);
  const navigateToDetail = () => {
    router.push(`/posts/${_id}`);
  };

  return (
    <div
      className="source-card-container cursor-pointer"
      style={{borderRadius: "25px"}}
      onClick={navigateToDetail}
    >
      <div className="d-flex flex-column justify-content-between h-100 ">
        <img
          src={thumbnail}
          alt="profile"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <div className="d-flex justify-content-between flex-column p-4">
          <NavLink
            className="h5 fw-500 text-color-inherit text-decoration-none"
            href={`/posts/${_id}`}  
          >
            <TextTruncated lines={2}>{title}</TextTruncated>
          </NavLink>
            <TextTruncated lines={4}>{description}</TextTruncated>
          <div className="d-flex justify-content-between align-items-center pt-3">
            {timeAgo}
            <Tag className="p-2" style={{backgroundColor: 'rgb(88 140 230)', color: 'white'}}>
              <span class="mx-2" style={{ fontWeight: 'bold' , fontSize: 15}}>Read more</span>
            </Tag>
          </div>
        </div>

      </div>

    </div>
  );
}

export default PostCard;
