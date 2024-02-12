import React from 'react';
import pt from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../config';
import { replace } from 'lodash';
import {
  CmsSettingJsCss,
  CmsSettingPreloadJs,
  CmsSettingWrapBody,
} from '@central-tech/core-ui';

/* eslint-disable react/no-danger */

class Html extends React.PureComponent {
  static propTypes = {
    title: pt.string.isRequired,
    description: pt.string,
    styles: pt.arrayOf(
      pt.shape({
        id: pt.string.isRequired,
        cssText: pt.string.isRequired,
      }).isRequired,
    ),
    scripts: pt.arrayOf(pt.string.isRequired),
    app: pt.object, // eslint-disable-line
    children: pt.string.isRequired,
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    app: {},
  };

  renderTagMeta() {
    const {
      title,
      description,
      app,
      base,
      canonical,
      metaImage,
      meta,
      helmetTitle,
      siteName,
      metaSeo,
    } = this.props;

    const renderTitle = !title ? (
      helmetTitle
    ) : (
      <React.Fragment>
        <title>{title}</title>
      </React.Fragment>
    );

    const renderMeta =
      !description && !title ? (
        meta
      ) : (
        <React.Fragment>
          <meta name="title" content={title} />
          <meta property="og:title" content={title} />
          <meta name="description" content={description || ''} />
          <meta property="og:description" content={description || ''} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description || ''} />
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <meta charSet="utf-8" />
        {app?.deviceDetect?.isMobile && (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        )}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        {renderTitle}
        {renderMeta}
        <meta property="og:image" content={metaImage} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="th_TH" />
        <meta property="og:url" content={`${base}${canonical}`} />
        <meta
          property="og:site_name"
          content={siteName || 'Supersports Online Shopping'}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@supersports_th" />
        <meta name="twitter:image:alt" content={description || ''} />

        <meta
          name="google-site-verification"
          content={`${metaSeo?.siteVerification || ''}`}
        />

        <meta property="fb:app_id" content={`${metaSeo?.fbAppId || ''}`} />
        <meta property="fb:pages" content={`${metaSeo?.fbPagesId || ''}`} />
      </React.Fragment>
    );
  }

  render() {
    const {
      styles,
      styled,
      scripts,
      app,
      children,
      base,
      canonical,
      lang,
      clientConfig,
      metaSeo,
    } = this.props;
    const globalJs = '/js/globalv2.js';

    return (
      <html className="no-js" lang={lang}>
        <head>
          {config?.noindex && <meta name="robots" content="noindex,nofollow" />}
          {this.renderTagMeta()}
          <link rel="canonical" href={`${base}${canonical}`} />
          <link
            rel="alternate"
            href={`${base}${replace(canonical, `/${lang}`, '/en')}`}
            hrefLang="en"
          />
          <link
            rel="alternate"
            href={`${base}${replace(canonical, `/${lang}`, '/th')}`}
            hrefLang="x-default"
          />
          <CmsSettingPreloadJs isMobile={app?.deviceDetect?.isMobile}>
            <link key={globalJs} rel="preload" href={globalJs} as="script" />
            {scripts.map(script => (
              <link key={script} rel="preload" href={script} as="script" />
            ))}
          </CmsSettingPreloadJs>
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/ssp-icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/ssp-icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/ssp-icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/ssp-icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/ssp-icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/ssp-icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/ssp-icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/ssp-icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/ssp-icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="icon"
            href="/icons/ssp-icons/favicon.png"
            type="image/png"
          />
          {styles.map(style => (
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          ))}
          {styled}
          <CmsSettingJsCss isMobile={app?.deviceDetect?.isMobile} />
          {/* <!-- Google Tag Manager --> */}
          {/* <!-- End Google Tag Manager --> */}
          {metaSeo?.gtmID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${metaSeo?.gtmID ||
              ''}');`,
              }}
            />
          )}
        </head>
        <CmsSettingWrapBody>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          {metaSeo?.gtmID && (
            <scripts
              dangerouslySetInnerHTML={{
                __html: `<!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${metaSeo?.gtmID ||
              ''},
            )}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->`,
              }}
            />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ClientConfig=${serialize(clientConfig)}`,
            }}
          />
          <script async type="text/javascript" src={globalJs}></script>
          {scripts.map(script => (
            <script key={script} src={script} async />
          ))}
        </CmsSettingWrapBody>
      </html>
    );
  }
}

export default Html;
