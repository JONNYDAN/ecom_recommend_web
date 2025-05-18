import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { getAbsolutePath } from "@/utils/pathUtils";
import { getCombineMetaData } from "@/config/seoMetric";

function MetaData(props) {
  const { isFollow, title, description, favicon, image, canonicalUrl, ogTypeArticle } = getCombineMetaData(props);

  return (
    <Head>
      <meta charSet="UTF-8"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Turn off SEO in non-prod env */}
      {isFollow ? <meta name="robots" content="index, follow" /> :
        <meta name="robots" content="noindex, nofollow" />
      }

    
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} key="og-title" />
          
        </>
      )}

      {description && (
        <>
          <meta
            name="description"
            content={description}
          />
          <meta
            property="og:description"
            content={description}
            key="og-description"
          />
        </>
      )}

      {favicon && <link rel="icon" type="image/x-icon" href={favicon} />}

      {title && (
        <>
          <meta property="og:image" content={getAbsolutePath(image)} />
        </>
      )}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {ogTypeArticle ? (
        <meta property="og:type" content="article" key="og-type" />
      ) :
        <meta property="og:type" content="website" key="og-type" />
      }

      <meta name="twitter:card" content="summary" />


       {/* JSON-LD schema markup */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": title,
              "description": description,
              "author": {
                "@type": "Person",
                "name": "BAOOStore JSC",
              }
            })
          }}
        />
    </Head>
  );
}

MetaData.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  // favicon url
  favicon: PropTypes.string,
};

export default MetaData;
