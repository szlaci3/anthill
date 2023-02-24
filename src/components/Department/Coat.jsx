import { useState } from 'react';
import depRight from '@/img/dep-right.svg';

/* implemented in Department. Represents one level from the department tree */
function Coat(props) {
  const [hi, setHi] = useState();

  const eachItem = (item, i) => (
    <div className="item" key={item.id}>
      <div className={"name" + (item.selected || hi == i ? " hi" : "")} data-index={i} onMouseEnter={openCoat} data-name={item.name} data-fid={item.id} data-pid={item.pid} onClick={props.selectDepartment}>
        {item.name}
        {item.sub[0] && (
          <img src={depRight} alt="" />
        )}
      </div>
      {hi == i && item.sub[0] && <Coat depObj={item} selectDepartment={props.selectDepartment}/>}
    </div>
  )

  const openCoat = (ev) => {
    setHi(ev.currentTarget.dataset.index);
  }

  return <div className="coat">
    <div className="shirt">
      {props.depObj.sub.map(eachItem)}
    </div>
  </div>
}

export default Coat;