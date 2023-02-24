import { useState, useEffect } from 'react';
import { Dropdown, Button, Checkbox } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';


function Filter(props) {
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (flag) => {
    setOpen(flag);
    if (!flag) {
      makeState(props.value || []);
    }
  }

  const onChange = (checkedList) => {
    makeState(checkedList);
  }

  const makeState = (checkedList) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < props.options.length);
    setIsAllChecked(checkedList.length === props.options.length);
  }

  const onCheckAllChange = (ev) => {
    setCheckedList(ev.target.checked ? props.options : []);
    setIndeterminate(false);
    setIsAllChecked(ev.target.checked);
  }

  const submit = () => {
    props.submit(checkedList);
    setOpen(false);
  }

  let suffix = `（${checkedList.length}）`;
  if (isAllChecked || checkedList.length === 0) {
    suffix = " - 所有";
  }

  const renderMenu = () => (
    <div className="payment-options">
      <Checkbox.Group
        options={props.options}
        value={checkedList}
        onChange={onChange}
      />

      <div className="filter-footer">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={isAllChecked}
        >
          所有
        </Checkbox>
        <Button type="primary" className="" size="small" onClick={submit}>
          确定
        </Button>
      </div>
    </div>
  )


  return (
    <Dropdown 
      overlay={renderMenu()}
      trigger={["click"]}
      className={props.className}
      visible={open}
      onVisibleChange={handleOpenChange}
    >
      <Button className="filter-main">
        <span className="text">{props.label} {suffix}</span>
        {open ? <UpOutlined/> : <DownOutlined />}
      </Button>
    </Dropdown>
  )
}

export default Filter;