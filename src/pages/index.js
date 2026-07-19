// src/pages/index.js
import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomeRedirect() {
  const history = useHistory();
  const { i18n } = useDocusaurusContext();

  useEffect(() => {
    // 首页重定向到文档首页（whats-new）；中英按 locale 路由分流
    if (i18n.currentLocale === 'zh-Hans') {
      history.push('/xburn_doc/whats-new');
    } else {
      history.push('/xburn_doc/en/whats-new');
    }
  }, [history, i18n]);

  return null; // 不渲染任何内容
}

export default HomeRedirect;