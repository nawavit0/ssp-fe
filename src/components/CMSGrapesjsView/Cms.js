import React from 'react';
import { CmsWidget, withLocales } from '@central-tech/core-ui';
import CmsRender from './CmsRender';
import propTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const Cms = ({
  identifier,
  urlKey,
  lang,
  ssr = false,
  customStyleObject = null,
  hasRenderCss = true,
  hasRenderJs = true,
  replaceHtml,
  blockLoading = false,
  wrapContent,
  renderSeo = false,
  className = '',
  ...rest
}) => {
  return (
    <CmsWidget
      {...rest}
      ssr={ssr}
      filter={{ identifier, url_key: urlKey }}
      skip={!identifier && !urlKey}
      context={{ batching: true }}
    >
      {({ data, loading }) => {
        if (loading) {
          if (wrapContent) {
            return wrapContent({ loading });
          } else if (blockLoading) {
            return blockLoading();
          }
          return <div>Loading CMS...</div>;
        }
        const cms = data?.cms?.cms_list?.[0];
        const content = cms?.contents || {};

        if (cms?._id) {
          return (
            <>
              {renderSeo && (
                <Helmet>
                  <title>{content?.meta?.title || ''}</title>
                  <meta name="title" content={content?.meta?.title || ''} />
                  <meta
                    property="og:title"
                    content={content?.meta?.title || ''}
                  />
                  <meta
                    name="twitter:title"
                    content={content?.meta?.title || ''}
                  />
                  <meta
                    name="description"
                    content={content?.meta?.description || ''}
                  />
                  <meta
                    property="og:description"
                    content={content?.meta?.description || ''}
                  />
                  <meta
                    property="og:image"
                    content={content?.meta?.image || ''}
                  />
                  <meta
                    name="twitter:description"
                    content={content?.meta?.description || ''}
                  />
                </Helmet>
              )}
              <CmsRender
                content={content}
                uniqid={`cms-${lang}-${cms._id}`}
                hasRenderCss={hasRenderCss}
                hasRenderJs={hasRenderJs}
                replaceHtml={replaceHtml}
                wrapContent={wrapContent}
                customStyleObject={customStyleObject}
                className={className}
              />
            </>
          );
        } else if (wrapContent) {
          return wrapContent({});
        }

        return null;
      }}
    </CmsWidget>
  );
};

Cms.propTypes = {
  ssr: propTypes.bool,
  renderSeo: propTypes.bool,
  customStyleObject: propTypes.object,
  hasRenderCss: propTypes.bool,
  hasRenderJs: propTypes.bool,
  replaceHtml: propTypes.array,
  identifier: propTypes.string,
};

export default withLocales(Cms);
