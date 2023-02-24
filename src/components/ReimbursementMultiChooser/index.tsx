import {useState, useEffect} from 'react';
import { Modal, Space, Input, Tag, Form } from 'antd';
import { useRequest, useModel } from 'umi';
import { expensesDeptList, clockDeptList } from './service';
import DE from './DE';
import { PageLoading } from '@ant-design/pro-layout';
import searchIcon from '@/img/编组_magnifier.svg';
import {
  FolderOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Search } = Input;

function ReimbursementMultiChooser(props) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
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
    let apis = {
      expensesDeptList,
      clockDeptList
    };
    let res = await apis[props.sourceAPI](query);
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
    if (props.visible && props.selectedItems) {
      setSelectedEmployees(props.selectedItems.staff || []);
      setSelectedDepartments(props.selectedItems.dept || []);
    }
  }, [props.visible]);

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
      if (dragDE.isStaff) {
        let mySelectedEmployees = selectedEmployees.slice();
        mySelectedEmployees.push(dragDE);
        setDragEntered(false);
        setDelayPassed(false);
        setDragDE(null);
        setSelectedEmployees(mySelectedEmployees);
      } else {
        let mySelectedDepartments = selectedDepartments.slice();
        mySelectedDepartments.push(dragDE);
        setDragEntered(false);
        setDelayPassed(false);
        setDragDE(null);
        setSelectedDepartments(mySelectedDepartments);
      }
    }
  }

  const eachStaff = (de, i) => (
    eachSelectedItem(de, i, true)
  )

  const eachDepartment = (de, i) => (
    eachSelectedItem(de, i, false)
  )

  const eachSelectedItem = (de, i, isStaff) => (
    <Tag key={i} closable onClose={deselect.bind(null, de.id, isStaff)} className={"item " + (isStaff ? "emp" : "dep")} icon={isStaff ? <UserOutlined/> : <FolderOutlined/>}>
      <span>{de.name}</span>
    </Tag>
  )

  const deselect = (id, isStaff, ev) => {
    ev.preventDefault();
    let directory = isStaff ? selectedEmployees : selectedDepartments;
    
    let selected = directory.slice();
    for (let i in selected) {
      if (selected[i].id == id) {
        selected.splice(i, 1);
      }
    }

    if (isStaff) {
      setSelectedEmployees(selected);
    } else {
      setSelectedDepartments(selected);
    }
  }

  const firefoxDragStart = (ev) => {
    ev.dataTransfer.setData('Text', 'a');   
  }

  const handleClickEmployee = (de) => {
    setDragDE(de);
    handleDrop();
  }

  const whetherSelected = (de) => {
    if (de.isStaff) {
      for (let i in selectedEmployees) {
        if (selectedEmployees[i].id == de.id) {
          return true;
        }
      }
    } else {
      for (let j in selectedDepartments) {
        if (selectedDepartments[j].id == de.id) {
          return true;
        }
      }
    }
    return false;
  }

  const eachFound = (emp, i) => {
    let isDragged = dragDE && emp.id === dragDE.id;

    return <div key={i} className={"de emp" + (whetherSelected(emp) ? " display-none" : "")}>
      <span draggable className={"item" + (isDragged ? " dragged-item" : "")} onMouseUp={handleClickEmployee.bind(null, emp)} onMouseDown={handleMouseDown.bind(null, emp)} onDragEnd={handleMouseUp}>
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
      selectedEmployees={selectedEmployees}
      selectedDepartments={selectedDepartments} 
      handleClickEmployee={handleClickEmployee}
      whetherSelected={whetherSelected}
    />
  )

  const handleSubmit = () => {
    let dept = getChosenDeps();

    props.storeChosen({dept: dept, staff: selectedEmployees});
  }

  const getChosenDeps = () => {
    // inp: arr with subs
    // outp: move subs to main
    let chosen = [];
    const addSubToChosen = (arr) => {
      for (let i=0; i<arr.length; i++) {
        if (!arr[i].isStaff) {// false (chosen now) or undefined (from api)
          // avoids adding duplicates, so the chosen array remains unique:
          chosen[arr[i].id] = {
            id: arr[i].id,
            name: arr[i].name,
          };
          if (arr[i].sub && arr[i].sub[0]) {
            addSubToChosen(arr[i].sub);
          }
        }
      }
    }
    addSubToChosen(selectedDepartments);
    return chosen.filter(item => item);// id-based array becomes 0-based (index-based)
  }

  return <>
    <Modal
      maskClosable={false}
      title={props.topTitle}
      visible={props.visible}
      okText="确认"
      onOk={handleSubmit}
      onCancel={props.close}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 reimbursement-chooser"
      width={800}
    >
      <div className="main fifty reim-chooser multi" onMouseMove={dragDE && dragEvent} onMouseUp={handleMouseUp}>
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
            {selectedEmployees && selectedEmployees.map(eachStaff)}
            {selectedDepartments && selectedDepartments.map(eachDepartment)}
          </div>

          <div className={"drop-here envelope9" + (delayPassed ? (dragEntered ? " entered" : " dragging") : "")} onDragOver={handleDragOver} onDrop={handleDrop}>
              <div/><div/><div/><div/>
              <div>拖动联系人至此</div>
              <div/><div/><div/><div/>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default ReimbursementMultiChooser;