import { Modal } from 'antd';
import { useState, useEffect } from 'react';

const ModalWithApi = (props) => {
  const [alive, setAlive] = useState();

  useEffect(() => {
    if (props.visible) {
      setAlive(true);
    } else {
      window.setTimeout(() => {
        setAlive(false);
      }, 300);
    }
  }, [props.visible]);

  if (!alive) {
    return null;
  }

  return (
    <Modal
      {...props}
      maskClosable={false}
      closeIcon={<span className="close-x">&times;</span>}
    />
  );
};

export default ModalWithApi;