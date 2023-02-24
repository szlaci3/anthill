import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';


function MenuItem(props) {
  if (props.whetherSelected(props.de)) {
    return <div/>
  }

  const toggleFolder = (ev) => {
    ev.preventDefault();
    props.setMeOpen && props.setMeOpen(props.isOpen ? null : props.de.id);
  }

  let isEmptyDep = !props.de.sub[0]; // whether has "open-close" arrow
  let isDragged = props.dragDE && props.de.id === props.dragDE.id;
  let iconNum = props.isParent ? (isDragged ? 2 : 1) : (isDragged ? 4 : 3);

  return <div className={"de dep" + (props.isOpen ? " open" : "") + (isEmptyDep ? " empty" : "")}>

    <span draggable className={"item" + (isDragged ? " dragged-item" : "")} onMouseUp={isEmptyDep ? props.handleClickItem.bind(null, props.de) : toggleFolder} onMouseDown={props.handleMouseDown.bind(null, props.de)} onDragStart={props.firefoxDragStart} onDragEnd={props.handleDragEnd}>
      <span className="inner">
        {!isEmptyDep && (props.isOpen ? <CaretDownOutlined/> : <CaretRightOutlined/>)}
        <img className="gear" src={require(`@/img/gear-${iconNum}.png`)}/>
        <span>{props.de.name}</span>
      </span>
    </span>
    {
      props.de.sub && props.de.sub.length > 0 && props.de.sub.map((de, index) => {
        return (<MenuItem
          key={de.id}
          de={de}
          handleMouseDown={props.handleMouseDown}
          dragDE={props.dragDE}
          firefoxDragStart={props.firefoxDragStart}
          handleDragEnd={props.handleDragEnd}
          handleClickItem={props.handleClickItem}
          whetherSelected={props.whetherSelected}
        />);
      })
    }
  </div>
}

export default MenuItem;