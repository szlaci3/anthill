import { Space } from 'antd';
import React from 'react';
import { useModel, Link } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import remindIcon from '@/img/提醒_remind.svg';
import app_switch from '@/img/app-switch.svg';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <a
        href={`${SERVERIP}/index.html`}
        className="messages-door"
        >
        <img alt="" src={app_switch} />
        切换至旧版
      </a>
      <Link
        to="/messages/unread"
        className="messages-door"
        >
        <img alt="" src={remindIcon} />
        系统通知
      </Link>
      <AvatarDropdown />
    </Space>
  );
};
export default GlobalHeaderRight;
