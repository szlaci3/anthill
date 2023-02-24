import { useState } from 'react';
import { Card, Button } from 'antd';
import { NavLink } from 'umi';
import { useModel } from 'umi';
import ChargingNotice from '@/components/ChargingNotice';

function SettingsTabs(props) {
  const [displayChargingNotice, setDisplayChargingNotice] = useState(false);
  const { initialState } = useModel('@@initialState');
  const { menu = [], currentUser } = initialState;
  const { vip } = currentUser;
  let hasAuth = false;

  for(var i = 0; i < menu.length; i++) {
    if (menu[i].id == 21) {
      hasAuth = true;
      break;
    }
  }

  const links = [
    {path: "/company-setup", text: "账户信息"},
    {path: hasAuth ? "/account-authorization" : "", text: "子账户"},
  ];

  const eachLink = ({path, text, className}, i) => {
    let accessDenied = vip == 0 && path === "/account-authorization";
    return <NavLink exact to={accessDenied ? {} : path} onClick={accessDenied ? () => setDisplayChargingNotice(true) : null} key={i} className="btn-tab" activeClassName="current">
      <Button size="small" className={className || ''} disabled={!path}>
        {text}
      </Button>
    </NavLink>
  };

  return <>
    <ChargingNotice
      visible={displayChargingNotice}
      onCancel={() => setDisplayChargingNotice(false)}
    />

    <Card className="top-section">
      <div className="t1">账户设置</div>
      <div className="tabs">{links.map(eachLink)}</div>
      {props.editBtns}
    </Card>
    {props.children}
  </>
}

export default SettingsTabs;