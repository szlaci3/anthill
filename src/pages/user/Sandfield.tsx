import { useState } from 'react';
import { Button } from 'antd';

function Hello() {
  const [displaySignPosition, setDisplaySignPosition] = useState<boolean>(false);

  const onOk = ():void => {
    setDisplaySignPosition(false);
  }

  return <>
    <div>HELLO MOND</div>
    <div>HELLO MOND</div>
    <div>HELLO MOND</div>
    <div>HELLO MOND</div>
    <Button type="link" onClick={() => setDisplaySignPosition(true)}>显示详情</Button>

    {displaySignPosition && <div>
      <div>Sign Position</div>
      <div onClick={onOk}>close</div>
     </div>}
  </>
}

export default Hello;