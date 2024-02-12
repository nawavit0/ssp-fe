import React, { useEffect, useState, Fragment } from 'react';
import { withLocales, GET_CMS } from '@central-tech/core-ui';
import propTypes from 'prop-types';
import { get } from 'lodash';

const GetCmsData = async (
  context,
  identifier,
  lang,
  setContent,
  callback,
  state,
) => {
  const { data } = await context.client.query({
    query: GET_CMS,
    variables: { filter: { identifier: identifier } },
  });
  const cms = get(data, 'cms.cms_list[0]');
  let content = '';
  if (cms) {
    content = cms.contents;
    if (callback && cms) {
      content = callback({ html: cms.contents.html, state });
    }
  }
  setContent(content);
  return true;
};

const CmsData = ({ identifier, lang, callback, state }, context) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    if (!content) {
      GetCmsData(context, identifier, lang, setContent, callback, state);
    }
  });
  return <Fragment>{content}</Fragment>;
};

CmsData.contextTypes = {
  client: propTypes.object.isRequired,
  insertCss: propTypes.func,
  pathname: propTypes.string,
  store: propTypes.object,
};

export default withLocales(CmsData);
