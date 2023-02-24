import { useState, useEffect } from 'react';


function Clock(props) {
  const [t, setT] = useState('');

  const getTime = () => {
    if (props.hasSeconds) {
      let m = (new Date).toTimeString();
      return m.slice(0, m.lastIndexOf(":") + 3);
    } else {
      let str = (new Date).toLocaleTimeString();
      return str.slice(0, str.lastIndexOf(":")) + str.slice(str.lastIndexOf(":") + 3);
    }
  }

  useEffect(() => {
    setT(getTime);
    const interval = window.setInterval(() => {
      setT(getTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className={props.className}>{t}</span>
}

export default Clock;