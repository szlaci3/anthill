import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <div className="ant-result ant-result-404">
    <div className="ant-result-icon ant-result-image">
      <img src={require("@/img/planet.png")} alt="" />
    </div>
    <div className="ant-result-title">404</div>
    <div className="ant-result-subtitle">抱歉，您访问的页面不存在。</div>
    <div className="ant-result-extra">
      <Button type="primary" onClick={() => history.push('/')}>
        返回
      </Button>
    </div>
  </div>
);

export default NoFoundPage;
