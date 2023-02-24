import { useState, useEffect } from 'react';
import { Switch } from 'antd';

const Toggle = function(props) {
  const {
    api,
    defaultChecked,
    switchProps = {},
  } = props;

  const [checked, setChecked] = useState(defaultChecked);
  const [loading, setLoading] = useState(false);

  const onClick = async (val, ev) => {
    setLoading(true);
    setChecked(val);
    let res = await api();
    let isDev = process.env.NODE_ENV === "development";

    if ((!isDev || !res.htmlRes) && res.status == 0) {
      setChecked(!val);
    }
    if (props.afterToggle) {
      props.afterToggle(val);
    }
  }


  return (
    <Switch
      className={`toggle ${props.className || ""}`}
      {...switchProps}
      onClick={onClick}
      checked={checked}
      loading={loading}
    />
  )
}

export default Toggle;