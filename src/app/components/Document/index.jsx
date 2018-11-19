import React, { Fragment } from 'react';
import ResourceHints from './ResourceHints';
import '../../lib/globalStyles';
import { C_POSTBOX, ampScript, ampNoscript } from '../../lib/constants/styles';

/* eslint-disable react/prop-types */
const Document = ({ assets, app, data, inlineCss, helmet }) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const meta = helmet.meta.toComponent();
  const title = helmet.title.toComponent();
  const links = helmet.link.toComponent();
  const serialisedData = JSON.stringify(data);
  const scriptsAllowed = !data.isAmp;
  const scripts = assets.map(asset => (
    <script
      crossOrigin="anonymous"
      key={asset}
      type="text/javascript"
      src={asset}
      defer
    />
  ));
  const inlineStyleAttributes = {};
  inlineStyleAttributes[data.isAmp ? 'amp-custom' : 'data-styled-components'] =
    '';

  return (
    <html lang="en-GB" {...htmlAttrs}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content={C_POSTBOX} />
        {meta}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
        <ResourceHints />
        {title}
        {links}
        <style {...inlineStyleAttributes}>{inlineCss}</style>
        {data.isAmp && (
          <Fragment>
            <style amp-boilerplate="">{ampScript}</style>
            <noscript>
              <style amp-boilerplate="">{ampNoscript}</style>
            </noscript>
          </Fragment>
        )}
        {data.isAmp && (
          <script key="amp" async src="https://cdn.ampproject.org/v0.js" />
        )}
      </head>
      <body>
        {/* eslint-disable react/no-danger */
        /* disabling the rule that bans the use of dangerouslySetInnerHTML until a more appropriate implementation can be implemented */}
        <div id="root" dangerouslySetInnerHTML={{ __html: app }} />
        {scriptsAllowed && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.SIMORGH_DATA=${serialisedData}`,
            }}
          />
        )}
        {scriptsAllowed && scripts}
      </body>
    </html>
  );
};

export default Document;
