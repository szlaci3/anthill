import {useState, useEffect} from 'react';
import { Radio, Modal, Space, Input, Tag, Form } from 'antd';
import { useRequest, useModel } from 'umi';
import { deptList } from './service';
import DE from './DE';
import { PageLoading } from '@ant-design/pro-layout';
const { Search } = Input;
import searchIcon from '@/img/编组_magnifier.svg';
import {
  UserOutlined,
} from '@ant-design/icons';
import { hasVal } from '@/utils/utils';

function ReimbursementChooser(props) {
  const [autoSuperior, setAutoSuperior] = useState(props.selectedItems && props.selectedItems.type == 0 ? 0 : 1);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [delayPassed, setDelayPassed] = useState();
  const [dragEntered, setDragEntered] = useState();
  const [dragDE, setDragDE] = useState();
  const [root, setRoot] = useState();
  const [department, setDepartment] = useState();
  const [staff, setStaff] = useState();
  const [found, setFound] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [searchError, setSearchError] = useState();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  useEffect(async () => {
    let query = {compamyid: currentUser.userid};
    if (searchValue) {
      query.staff_name = searchValue;
    }
    let res = await deptList(query);
    if (res.data) {
      if (res.data.department) {
        setRoot(organizeRoot(res.data));
        setDepartment(res.data.department);
        setStaff(res.data.staff);
        setFound(null);
      } else {
        let _found = [];
        for (let i in res.data) {
          _found.push({
            isStaff: true,
            id: res.data[i].staff_id,
            name: res.data[i].staff_name
          });
        }
        setFound(_found);
      }
      setSearchError();
    } else if (res.code == 0) {
      setSearchError(res.msg);
    }
  }, [searchValue]);

  useEffect(() => {
    setSelectedEmployee(props.selectedItems);
  }, [props.visible]);

  const handleRadio = ev => {
    setAutoSuperior(ev.target.value);
  }

  const handleOk = () => {
    if (props.storeAutoSuperior && autoSuperior == 1) {
      props.storeAutoSuperior(autoSuperior);
      props.close();
    } else {
      handleSubmit();
    }
  }

  const organizeRoot = (data) => {
    let department = data.department;
    let staff = data.staff;
    let root = {
      id: department[0].d_id,
      pid: null,
      name: department[0].d_name,
      isStaff: false,
      sub: [],
      childOpen: 0 // This value is in the DE's state, so root will not store it. Only the first item in root will store it.
    };
        
    let empDir = {};
    empDir[root.id] = root;
    let id;
    let pid;
    let name;

    for(let i = 1; i < department.length; i++) {
      let dep = department[i];
      id = dep.d_id;
      pid = dep.d_pid;
      name = dep.d_name;
      if (typeof empDir[pid] !== "undefined") {
        empDir[id] = {
          id: id,
          pid: pid,
          name: name,
          isStaff: false,
          sub: []
        };
        empDir[pid].sub.push(empDir[id]);
      }
    }

    for(let j = 0; j < staff.length; j++) {
      let emp = staff[j];
      id = emp.s_id;
      pid = emp.s_pid;
      name = emp.s_name;
      if (typeof empDir[pid] !== "undefined") {
        empDir[id] = {
          id: id,
          pid: pid,
          name: name,
          isStaff: true
        };
        empDir[pid].sub.push(empDir[id]);
      }
    }
    return root;
  }

  const dragEvent = (e) => {
    setDelayPassed(true);
  }
  
  const handleMouseDown = (de) => {
    setDragDE(de);
  }

  const handleMouseUp = () => {
    setDragDE(null);
    setDelayPassed(false);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragEntered(true);
  }

  const handleDrop = (ev) => {
    ev && ev.preventDefault && ev.preventDefault();//firefox
    if (dragDE) {
      setDragEntered(false);
  	  setDelayPassed(false);
  	  setDragDE(null);
  	  setSelectedEmployee(dragDE);
    }
  }

  const deselect = (ev) => {
    ev.preventDefault();
    setSelectedEmployee(null);
  }

  const renderSelectedItem = (de) => (
    <Tag closable onClose={deselect} className="item emp"
      icon={<UserOutlined/>}
      >
      <span>{de.name}</span>
    </Tag>
  )

  const firefoxDragStart = (ev) => {
    ev.dataTransfer.setData('Text', 'a');   
  }

  const handleClickEmployee = (de) => {
    setDragDE(de);
    handleDrop();
  }

  const whetherSelected = (de) => {
    if (selectedEmployee && selectedEmployee.id == de.id) {
      return true;
    }
    for (let i in props.m_default) {
      // if selected on other levels, don't show it
      // if it is the originally selected item and went back to left side, show it
      if (props.m_default[i].id == de.id && (!props.selectedItems || props.selectedItems.id != de.id)) {
        return true;
      }
    }
    return false;
  }

  const eachFound = (emp, i) => {
    let isDragged = dragDE && emp.id === dragDE.id;
    let draggable = !selectedEmployee || !hasVal(selectedEmployee.id);
    return <div key={i} className={"de emp" + (whetherSelected(emp) ? " display-none" : "")}>
      <span draggable={draggable} className={"item" + (isDragged ? " dragged-item" : "")} onMouseUp={draggable ? handleClickEmployee.bind(null, emp) : null} onMouseDown={handleMouseDown.bind(null, emp)} onDragEnd={handleMouseUp}>
        <UserOutlined/>
        <span className="inner"><span>{emp.name}</span></span>
      </span>
    </div>
  }

  const renderDE = () => (
    <DE
      de={root}
      key="de-0"
      isOpen={true}
      firefoxDragStart={firefoxDragStart}
      handleMouseDown={handleMouseDown}
      dragDE={delayPassed && dragDE}
      handleDragEnd={handleMouseUp}
      selectedEmployee={selectedEmployee}
      handleClickEmployee={handleClickEmployee}
      whetherSelected={whetherSelected}
    />
  )

  const handleSubmit = () => {
    props.storeChosen(selectedEmployee);
  }


  return <>
    <Modal
      maskClosable={false}
      title={props.topTitle}
      visible={props.visible}
      okText={props.okText || "确认"}
      onOk={handleOk}
      onCancel={props.close}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 reimbursement-chooser"
      width={800}
      confirmLoading={props.confirmLoading}
      okButtonProps={{disabled: (!props.storeAutoSuperior || autoSuperior != 1) && !selectedEmployee}}
    >
      {props.storeAutoSuperior && (
        <Radio.Group
          value={autoSuperior}
          onChange={handleRadio}
        >
          <Space direction="vertical">
            <Radio value={1}>
              上级  （ 自动设置组织架构当中的上级领导为审批人 ）
            </Radio>
            <Radio value={0}>
              单个成员
            </Radio>
          </Space>
        </Radio.Group>
      )}

      {props.topMessage && <div className="top-message">{props.topMessage}</div>}

      {props.storeAutoSuperior && autoSuperior == 1 ? (
        <Space direction="vertical" className="main">
          请选择上级审批方式
          <Radio checked={true} disabled>
            会签  （ 须所有上级同意 ）
          </Radio>
        </Space>
      ) : (
        <div className="main fifty reim-chooser" onMouseMove={dragDE && dragEvent} onMouseUp={handleMouseUp}>
          <div>
            <Form.Item style={{ marginBottom: 8 }} className={searchError ? "search-error ant-form-item-with-help ant-form-item-has-error" : ""} >
              <Search placeholder="搜索成员" allowClear onSearch={setSearchValue} className="u-search" enterButton={<img alt="" src={searchIcon} />}/>
              {searchError && <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{searchError}</div></div>}
            </Form.Item>

            {found ? (/* search results*/
              found.map(eachFound)
            ) : (
              root ? renderDE() : <div className="small-loading centered-loading"><PageLoading size="default"/></div>
            )}
          </div>
          <div>
            <h3>{props.blueTitle}</h3>
            <div className="selection-tags">
              <span className="title">{props.blackTitle}</span>
              {selectedEmployee && selectedEmployee.id && renderSelectedItem(selectedEmployee)}
            </div>

            <div className={"drop-here envelope9" + (delayPassed ? (dragEntered ? " entered" : " dragging") : "")} onDragOver={handleDragOver} onDrop={handleDrop}>
              <div/><div/><div/><div/>
              <div>拖动联系人至此</div>
              <div/><div/><div/><div/>
            </div>
          </div>
        </div>
      )}
    </Modal>
  </>
}

export default ReimbursementChooser;