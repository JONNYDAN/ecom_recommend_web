import { useMemo } from "react";
import { useRouter } from "next/router";
import { Tag } from "rsuite";

import { getRawText } from "@/utils/stringUtils";
import NavLink from "../Navigation/NavLink";
import SafeImage from "../common/SafeImage";
import TextTruncated from "../common/TextTruncated";
import {
  MdRemoveRedEye,
  MdDownload,
} from "react-icons/md";

function SourceCard({
  id,
  name,
  description,
  short_description,
  database,
  technical,
  thumbnail,
  fize_size,
  download_count,
  is_free,
  view_count,
  slug,
  price,
  category,
}) {
  const router = useRouter();

  const rawDescription = getRawText(short_description);
  const tagList = useMemo(() => {
    // maximum 5 tags
    return [category, ...technical, ...database].filter((v) => v).slice(0, 5);
  }, [category, database, technical]);

  const navigateToDetail = () => {
    router.push(`/sources/${slug}`);
  };

  const renderPrice = ({is_free, price}) => {
    if (is_free) {
      return (
        <Tag className="ms-2 fw-700 text-uppercase" color="blue">
          free
        </Tag>
      );
    }

    // return price
    return  <div class="ms-2"><span class="text-danger" style={{fontSize: '20px'}}><b>{price} đ</b></span></div>
  }
  const renderViewCount = ({view_count, download_count}) => {
    return (
      <div class="">
        <span class="mx-2"><MdRemoveRedEye color="deepskyblue" size="20"/> {view_count}</span>
        <span class="mx-2"><MdDownload color="lightseagreen" size="20"/> {download_count}</span>
      </div>
    )
  }

  return (
    <div
      className="source-card-container cursor-pointer shadow-sm rounded "
      onClick={navigateToDetail}
    >
      <SafeImage
        src={thumbnail}
        height="720"
        width="480"
        className="source-thumbnail"
        alt={name}
      />
      <div className="d-flex flex-column justify-content-between p-3 h-100 ">
        <NavLink
          className="h5 fw-500 text-color-inherit"
          href={`/sources/${slug}`}
        >
          {name}
        </NavLink>
        <TextTruncated lines={3}>{rawDescription}</TextTruncated>
        <div class="d-flex gap-5 justify-content-between align-items-center my-2">
          {renderPrice({is_free, price})}
          {renderViewCount({view_count, download_count})}
          </div>
      
        <div className="d-flex mt-2 flex-wrap gap-2 align-items-center">
          {tagList.map((item, index) => (
            <Tag key={index} className="m-0">
              #{item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SourceCard;
