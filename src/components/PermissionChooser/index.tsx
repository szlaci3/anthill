import {useState, useEffect} from 'react';
import { getTitle } from '@/services/globalServices';
import { giveJurisdiction } from './service';
import { message, Modal, Input, Tag, Form } from 'antd';
import { useModel } from 'umi';
import MenuItem from './MenuItem';
import { PageLoading } from '@ant-design/pro-layout';
import searchIcon from '@/img/编组_magnifier.svg';
import { hasVal, toArrayIfPossible } from '@/utils/utils';
const { Search } = Input;

function PermissionChooser(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSaveLoading, setIsSaveLoading] = useState();
  const [delayPassed, setDelayPassed] = useState();
  const [dragEntered, setDragEntered] = useState();
  const [dragDE, setDragDE] = useState();
  const [menu, setMenu] = useState();
  const [found, setFound] = useState();
  const [searchValue, setSearchValue] = useState();
  const [searchError, setSearchError] = useState();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [childOpen, setChildOpen] = useState(2);
  const staffid = props.currentPerson && props.currentPerson[props.rowKey];
  const jurisdiction = props.currentPerson && props.currentPerson.column_8;

  useEffect(async () => {
    if (props.currentPerson) {
      let query = {compamyid: currentUser.userid, type: 1};
      if (searchValue) {
        query.search = searchValue;
      }
      let menuRes = await getTitle(query);
      const resData = menuRes.data ? toArrayIfPossible(menuRes.data).filter(one => one) : [];
      if (resData && resData.length > 0) {
        if (searchValue) {
          setFound(resData);
        } else {
          setMenu(organizeRoot(resData));// menu is an array.
          setFound(null);
          if (!hasVal(searchValue)) {
            setSelectedItems(organizeSelected(resData, jurisdiction));
          }
        }
        setSearchError();
      } else {
        setSearchError(menuRes.msg || "无相关数据");
      }
    }
  }, [props.currentPerson, searchValue]);

  const organizeRoot = (data) => {
    let root = {
      id: 0,
      sub: [],
    };
        
    let linkDir = {};
    linkDir[root.id] = root;

    for(let i = 0; i < data.length; i++) {
      const link = data[i];
      if (!link) {
        continue;
      }
      const id = link.id;
      const pid = link.pid;
      const name = link.name;
      if (typeof linkDir[pid] !== "undefined") {
        linkDir[id] = {
          id,
          pid,
          name,
          sub: []
        };
        linkDir[pid].sub.push(linkDir[id]);
      }
    }
    return root.sub;
  }

  const organizeSelected = (data, jurisdiction) => {
    if (!jurisdiction || !jurisdiction[0]) {
      return [];
    }
    const selectedIds = jurisdiction.split(",");
    let sRoot = {
      id: 0,
      sub: [],
    };
        
    let sLinkDir = {};
    sLinkDir[sRoot.id] = sRoot;

    for(let i = 0; i < data.length; i++) {
      const link = data[i];
      if (!link) {
        continue;
      }
      const id = link.id;
      const pid = link.pid;
      const name = link.name;
      if (selectedIds.indexOf(String(id)) !== -1 && typeof sLinkDir[pid] !== "undefined") {
        sLinkDir[id] = {
          id,
          pid,
          name,
          sub: []
        };
        sLinkDir[pid].sub.push(sLinkDir[id]);
      }
    }
    return sRoot.sub;
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
    let _selectedItems = selectedItems.slice();
    const item = dragDE;
    let scroll = false;

    if (item.pid != 0) {// has parent
      const pindex = getIndexOfItem(item.pid, _selectedItems);
      if (pindex === -1) {// parent is not selected
        const pindexInMenu = getIndexOfItem(item.pid, menu);
        _selectedItems.push({
          id: menu[pindexInMenu].id,
          name: menu[pindexInMenu].name,
          pid: menu[pindexInMenu].pid,
          sub: [item]
        });
        scroll = true;
      } else {
        _selectedItems[pindex].sub.push(item);
      }
    } else {
      const itemClone = {
        id: item.id,
        name: item.name,
        pid: item.pid,
        sub: item.sub ? item.sub.slice() : []
      };
      if (item.sub && item.sub[0]) { // not empty
        const index = getIndexOfItem(item.id, _selectedItems);
        if (index !== -1) {
          _selectedItems.splice(index, 1, itemClone);// selected? Remove and add entirely.
        } else {
          _selectedItems.push(itemClone);
          scroll = true;
        }
      } else {
        _selectedItems.push(itemClone);
        scroll = true;
      }
    }
    setDragEntered(false);
    setDelayPassed(false);
	  setDragDE(null);
    setSelectedItems(_selectedItems);

    if (scroll) {
      window.setTimeout(() => {
        document.getElementById("result").scrollTo({
          left: 0,
          top: 999,
          behavior: 'smooth'
        });
      }, 20);
    }
  }

  const eachSelectedMainItem = (de, i) => (
    <div className="chosen-group" key={de.id}>
      <div className="chosen-parent">
        <Tag key={i} closable onClose={deselectMainItem.bind(null, de.id)} className="item emp"
          icon={<img src={require('@/img/gear-2.png')}/>}
        >
          <span>{de.name}</span>
        </Tag>
      </div>
      <div className="children-group">
        {de.sub && de.sub.map(eachSelectedSub)}
      </div>
    </div>
  )

  const eachSelectedSub = (de, i) => (
    <Tag key={i} closable onClose={deselectSub.bind(null, de.id, de.pid)} className="item emp chosen-child"
      icon={<img src={require('@/img/gear-4.png')}/>}
    >
      <span className="name">{de.name}</span>
    </Tag>
  )

  const deselectMainItem = (id) => {
    let _selectedItems = selectedItems.slice();

    for (let i in _selectedItems) {
      if (_selectedItems[i].id == id) {
        _selectedItems.splice(i, 1);
      }
    }
    setSelectedItems(_selectedItems);
  }

  const deselectSub = (id, pid) => {
    let _selectedItems = selectedItems.slice();

    let pindex = getIndexOfItem(pid, _selectedItems);
    let index = getIndexOfItem(id, _selectedItems[pindex].sub);
    if (pindex !== -1 && index !== -1) {
      if (_selectedItems[pindex].sub.length > 1) {
        _selectedItems[pindex].sub.splice(index, 1);
      } else {
        _selectedItems.splice(pindex, 1);
      }
    }

    setSelectedItems(_selectedItems);
  }

  const firefoxDragStart = (ev) => {
    ev.dataTransfer.setData('Text', 'a');   
  }

  const handleClickItem = (de) => {
    setDragDE(de);
    handleDrop();
  }

  const whetherSelected = (de) => {
    if (de.pid == 0) {
    // whetherFullySelectedMainItem
      const index = getIndexOfItem(de.id, selectedItems);
      if (index === -1) {
        return false;
      }

      // has a sub that is not selected
      if (de.sub) {// search results have no subs and don't even contain a []
        // can only search for sub or main_without_sub, no main_with_sub. 
        for (let i=0; i<de.sub.length; i++) {
          if (getIndexOfItem(de.sub[i].id, selectedItems[index].sub) === -1) {
            return false;
          }
        }
      }

      return true;
    } else {
    // whetherSelectedSub
      const pindex = getIndexOfItem(de.pid, selectedItems);
      if (pindex === -1 || !selectedItems[pindex].sub || !selectedItems[pindex].sub[0]) {// parent not selected, or erronously has no subs
        return false;
      }
      return getIndexOfItem(de.id, selectedItems[pindex].sub) !== -1;
    }
  }

  const getIndexOfItem = (id, arr) => {
    return arr.findIndex(item => item.id == id);
  }

  const eachFound = (emp, i) => {
    let isDragged = dragDE && emp.id === dragDE.id;
    let iconNum = emp.pid === 0 ? (isDragged ? 2 : 1) : (isDragged ? 4 : 3);

    return <div key={i} className={"de found" + (emp.pid === 0 ? " dep" : " emp") + (whetherSelected(emp) ? " display-none" : "")}>
      <span draggable className={"item" + (isDragged ? " dragged-item" : "")} onMouseUp={handleClickItem.bind(null, emp)} onMouseDown={handleMouseDown.bind(null, emp)} onDragEnd={handleMouseUp}>
        <img className="found-gear" src={require(`@/img/gear-${iconNum}.png`)}/>
        <span className="inner"><span>{emp.name}</span></span>
      </span>
    </div>
  }

  const eachMainItem = (item, i) => (
    <MenuItem
      de={item}
      key={item.id}
      isOpen={childOpen == item.id}
      setMeOpen={setChildOpen}
      firefoxDragStart={firefoxDragStart}
      handleMouseDown={handleMouseDown}
      dragDE={delayPassed && dragDE}
      handleDragEnd={handleMouseUp}
      handleClickItem={handleClickItem}
      whetherSelected={whetherSelected}
      isParent={true}
    />
  )

  const getIds = (item, i) => {
    if (item.sub && item.sub[0]) {
      return item.id + "," + item.sub.map(getIds).join(",");
    } else {
      return item.id;
    }
  }

  const save = async () => {
    const selectedIds = selectedItems.map(getIds).join(",");

    setIsSaveLoading(true);
    let res = await giveJurisdiction({id: staffid, jurisdiction: selectedIds});
    setIsSaveLoading(false);
    if (res.code != 0) {
      message.success("操作完成");
      props.onClose();
      props.reloadList();
    }
  }


  return <>
    <Modal
      maskClosable={false}
      title="权限设定"
      visible={!!props.currentPerson}
      okText="确认"
      onOk={save}
      onCancel={props.onClose}
      confirmLoading={isSaveLoading}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 permission-chooser"
      width={800}
    >
      <div className="main fifty reim-chooser" onMouseMove={dragDE && dragEvent} onMouseUp={handleMouseUp}>
        <div>
          <Form.Item style={{ marginBottom: 8 }} className={searchError ? "search-error ant-form-item-with-help ant-form-item-has-error" : ""} >
            <Search placeholder="搜索成员" allowClear onSearch={setSearchValue} className="u-search" enterButton={<img alt="" src={searchIcon} />}/>
            {searchError && <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{searchError}</div></div>}
          </Form.Item>

          {found ? (/* search results*/
            found.map(eachFound)
          ) : (
            menu ? menu.map(eachMainItem) : <div className="small-loading centered-loading"><PageLoading size="default"/></div>

          )}
        </div>

        <div>
          <div className="envelope9">
            <div/><div/><div/>
            <div/><div/><div/>
            <div/><div/><div/>
          </div>
          <div id="result" className={"drop-here" + (delayPassed ? (dragEntered ? " entered" : " dragging") : "")} onDragOver={handleDragOver} onDrop={handleDrop}>

            <h3>已选择的权限</h3>
            <div className="selection-tags">
              {selectedItems && selectedItems.map(eachSelectedMainItem)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default PermissionChooser;