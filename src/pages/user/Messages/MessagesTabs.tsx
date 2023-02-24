import { Card, Button } from 'antd';
import { NavLink } from 'umi';

function MessagesTabs(props) {
  const links = [
    {path: "/messages/unread", text: "最新消息"},
    {path: "/messages/read", text: "已读文件"},
  ];

  const eachLink = ({path, text, className}, i) => (
    <NavLink exact to={path} key={i} className="btn-tab" activeClassName="current">
      <Button size="small" className={className || ''}>
        {text}
      </Button>
    </NavLink>
  );

  return <>
    <Card className="top-section">
      <div className="t1">系统通知</div>
      <div className="tabs">{links.map(eachLink)}</div>
    </Card>
    {props.children}
  </>
}

export default MessagesTabs;