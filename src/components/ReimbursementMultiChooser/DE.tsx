import {useState, useEffect} from 'react';
import { message, Radio, Modal, Space, Tree, Input, Tag } from 'antd';
import {
  FolderOutlined,
  UserOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';


function DE(props) {
  if (props.whetherSelected(props.de)) {
    return <div/>
  }

  const [childOpen, setChildOpen] = useState(props.de.childOpen);

  const toggleFolder = (ev) => {
    ev.preventDefault();
    props.setMeOpen && props.setMeOpen(props.isOpen ? null : props.index);
  }

  let isEmptyDep = true;
  if (!props.de.isStaff) {
    if (!props.de.sub[0]) {
      isEmptyDep = true;
    } else {
      isEmptyDep = true;
      for (let j in props.de.sub) {
        if (!props.whetherSelected(props.de.sub[j])) {
          isEmptyDep = false;
          break;
        }
      }
    }
  }
  let isDragged = props.dragDE && props.de.id === props.dragDE.id && props.de.isStaff === props.dragDE.isStaff;

  return <div className={"de " + (props.de.isStaff ? "emp" : "dep") + (props.isOpen ? " open" : "") + (isEmptyDep ? " empty" : "")}>
    <span draggable className={"item" + (isDragged ? " dragged-item" : "")} onMouseUp={isEmptyDep ? props.handleClickEmployee.bind(null, props.de) : toggleFolder} onMouseDown={props.handleMouseDown.bind(null, props.de)} onDragStart={props.firefoxDragStart} onDragEnd={props.handleDragEnd}>
      {!isEmptyDep && (props.isOpen ? <CaretDownOutlined/> : <CaretRightOutlined/>)}
      {props.de.isStaff ? <UserOutlined/> : <FolderOutlined/>}
      <span className="inner"><span>{props.de.name}</span></span>
    </span>
    {
      props.de.sub && props.de.sub.length > 0 && props.de.sub.map((de, index) => {
        return (<DE
          key={'de-' + de.id}
          index={index}
          de={de}
          isOpen={childOpen == index}
          setMeOpen={setChildOpen}
          handleMouseDown={props.handleMouseDown}
          dragDE={props.dragDE}
          firefoxDragStart={props.firefoxDragStart}
          handleDragEnd={props.handleDragEnd}
          handleClickEmployee={props.handleClickEmployee}
          whetherSelected={props.whetherSelected}
        />);
      })
    }
  </div>
}

export default DE;