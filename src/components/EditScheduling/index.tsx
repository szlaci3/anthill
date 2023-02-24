import { useState, useEffect, useRef } from 'react';
import { Space, Input, Tag, Button, Popover, Menu } from 'antd';
import { useRequest, useModel } from 'umi';
import { ImportOutlined } from '@ant-design/icons';
import icon4 from '@/img/外部传输_external-transmission.svg';
import { clockDeptList } from './service';
import ProTable from '@ant-design/pro-table';
import ScheduleUploadPopup from './ScheduleUploadPopup';
import { hasVal } from '@/utils/utils';
import { useEvent } from 'react-use';
import ModalWithApi from '@/components/ModalWithApi';

function ListenerComponent(props) {
  useEvent('scroll', props.closeCellOrRowPopover, window, {capture: true});
  return <></>;
}

function EditScheduling(props) {
  const [stoneStyle, setStoneStyle] = useState({});
  const [time, setTime] = useState([]);
  const [currentRow, setCurrentRow] = useState();
  const [currentCol, setCurrentCol] = useState();
  const [month, setMonth] = useState();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [thisYear, setThisYear] = useState(new Date().getFullYear());
  const [thisMonth, setThisMonth] = useState(() => {
    let _thisMonth = new Date().getMonth()+1;
    if(_thisMonth<10) {
      _thisMonth = "0"+_thisMonth;
    }
    return _thisMonth;
  });
  const [quickYear, setQuickYear] = useState(thisYear);
  const [quickMonth, setQuickMonth] = useState(thisMonth);
  const [displayUpload, setDisplayUpload] = useState();

  let popoverRowRef = useRef(currentRow);
  popoverRowRef.current = currentRow;

  const staffRes = useRequest((params) => clockDeptList({ ...params, compamyid: currentUser.userid }));
  const {staff} = staffRes.data || {};

  const closeCellOrRowPopover = () => {
    if (hasVal(popoverRowRef.current)) {
      setCurrentRow();
      setCurrentCol();
    }
  }

  useEffect(() => {
    props.stopSpinner();
  }, [staffRes]);

  useEffect(() => {
    if (props.visible) {
      let _time = props.time.slice() || [];
      _time.push({
        ct_name:"休息",
        holiday: true,
      });
      for (let i in _time) {
        if(!_time[i]["ct_date"]) {
          _time[i]["ct_date"] = {};
        } 
        _time[i]["color"] = props.color[i];
      }
      setTime(_time);
    }
  }, [props.visible]);


  const getCompleteDay = (days) => {
    if (days<10) {
      days = "0"+days;
    }
    return days;
  }

  const onOk = () => {
    let newTime = [];
    let _time = time.slice();
    let c_end_time="", year_="", month_="", day_="";
    for (let j in _time) {
      if(!_time[j].holiday) {
        delete _time[j].color;
        newTime.push(_time[j]);
      }
    }
    for (let i in newTime) {
      let ct_date = {...newTime[i].ct_date};
      for(let key in ct_date) {
        for(let j in ct_date[key]) {
          let year = parseInt(ct_date[key][j].substring(0,4));
          let month = parseInt(ct_date[key][j].substring(5,7));
          let day = parseInt(ct_date[key][j].substring(8,10));
          if(year>year_) {
            year_=year;
            c_end_time = year+"-"+getCompleteDay(month)+"-"+getCompleteDay(day);
          }else if(year==year_&&month>month_) {
            month_=month;
            c_end_time = year+"-"+getCompleteDay(month)+"-"+getCompleteDay(day);
          }else if(year==year_&&month==month_&&day>day_) {
            day_=day;
            c_end_time = year+"-"+getCompleteDay(month)+"-"+getCompleteDay(day);
          }
        }
      }
    }
    let editSchedulingData = {
      time:newTime,
      c_end_time:c_end_time,
    }
    props.onOk(editSchedulingData);
    closePopup();
  }

  const closePopup = () => {
    setCurrentCol();
    setCurrentRow();
    setStoneStyle({});
    props.close();    
  }

  const getDates = () => {
    let dateList = [];
    let month0based = +thisMonth - 1;
    let dates = new Date(thisYear,thisMonth,0).getDate();
    for(let i=1;i<=dates;i++) {
      let weeks = new Date(thisYear,month0based,i).getDay();  
      let date = {date:"",week:""};
      let week = "";
      switch (weeks) {
        case 0 :
          week = "日";
          break;
        case 1 :  
          week = "一";
          break;
        case 2 :  
          week = "二";
          break;
        case 3 :  
          week = "三";
          break;
        case 4 :  
          week = "四";
          break;
        case 5 :  
          week = "五";
          break;
        case 6 :  
          week = "六";
          break;
      }
      if(i<10) {
        i="0"+i;
      }
      date["date"] = thisYear+"-"+thisMonth+"-"+i;
      date["week"] = week;
      dateList.push(date)
    }
    return dateList;
  }

  let exportQuery = time.map(item => ({name: item.ct_name, date: item.ct_date}))
  exportQuery = JSON.stringify(exportQuery);

  const popoverTriage = () => {
    if (currentRow && currentCol) {
      return popoverCell(currentRow, currentCol);
    } else if (currentCol) {
      return popoverCol(currentCol);
    } else if (currentRow) {
      return popoverRow(currentRow);
    }
  }

  const popoverCol = (col_date) => (
    <Menu>
      {time.map((shift, i) => (
        <Menu.Item key={i} onClick={onSelectCol.bind(null, col_date, i)}>
          <span style={{"borderBottom":"2px solid "+shift.color}}>{shift.ct_name}</span>
        </Menu.Item>
      ))}
    </Menu>
  )

  const popoverRow = (s_id) => (
    <Menu>
      {time.map((shift, i) => (
        <Menu.Item key={i} onClick={onSelectRow.bind(null, s_id, i)}>
          <span style={{"borderBottom":"2px solid "+shift.color}}>{shift.ct_name}</span>
        </Menu.Item>
      ))}
    </Menu>
  )

  const popoverCell = (s_id, col_date) => (
    <Menu>
      {time.map((shift, i) => (
        <Menu.Item key={i} onClick={onSelectCell.bind(null, s_id, col_date, i)}>
          <span style={{"borderBottom":"2px solid "+shift.color}}>{shift.ct_name}</span>
        </Menu.Item>
      ))}
    </Menu>
  )

  let dates = getDates();

  const onChangeCalendar = (num) => {
    let _thisYear = parseInt(quickYear);
    let _thisMonth = parseInt(quickMonth);
    _thisMonth = _thisMonth+num;
    if(_thisMonth>12) {
      _thisYear = _thisYear+1;
      _thisMonth = 1;
    }else if(_thisMonth<1) {
      _thisYear = _thisYear-1;
      _thisMonth = 12;
    }
    if(_thisMonth<10) {
      _thisMonth = "0"+_thisMonth;
    }
    setQuickYear(_thisYear);
    setQuickMonth(_thisMonth);
    window.setTimeout(() => {
      // user can click many times, quickly change number but change calend. later. 
      setThisMonth(_thisMonth);
      setThisYear(_thisYear);
    }, 50);
  }

  const clearCurrentSelectCol  = (col_date, aShift, j) => {
    let _aShift = {...aShift};
    let ct_date = {..._aShift.ct_date};
    for (let i=0; i<staff.length; i++) {
      ct_date[staff[i].s_id] = (ct_date[staff[i].s_id] || []).slice();
      let index1 = ct_date[staff[i].s_id].indexOf(col_date);
      if (index1 !== -1) {
        ct_date[staff[i].s_id].splice(index1, 1);
      }
      if (ct_date[staff[i].s_id].length==0) {
        delete ct_date[staff[i].s_id];
      }
    }
    _aShift.ct_date = ct_date;
    return _aShift;
  }

  const onSelectCol = (col_date, shiftIdx) => {
    let _time = time.map(clearCurrentSelectCol.bind(null, col_date));
    let ct_date = {..._time[shiftIdx].ct_date};
    for (let i=0; i<staff.length; i++) {
      ct_date[staff[i].s_id] = (ct_date[staff[i].s_id] || []).slice();
      if (ct_date[staff[i].s_id].indexOf(col_date) === -1) {
        ct_date[staff[i].s_id].push(col_date);
      }
    }

    _time[shiftIdx].ct_date = ct_date;
    setTime(_time);
    setCurrentCol();
  }

  const clearCurrentSelectRow  = (s_id, aShift, j) => {
    let timestamp = Date.parse(new Date());
    let _aShift = {...aShift};
    let ct_date = {..._aShift.ct_date};
    ct_date[s_id] = (ct_date[s_id] || []).slice();
    for (let i=0; i<dates.length; i++) {
      let timestamp1 = Date.parse(new Date(dates[i].date));
      let index1 = ct_date[s_id].indexOf(dates[i].date);
      if (timestamp <= timestamp1 && index1 !== -1) {
        ct_date[s_id].splice(index1, 1);
      }
    }
    if (ct_date[s_id].length==0) {
      delete ct_date[s_id];
    }
    _aShift.ct_date = ct_date;
    return _aShift;
  }

  const onSelectRow = (s_id, shiftIdx) => {
    let timestamp = Date.parse(new Date());
    let _time = time.map(clearCurrentSelectRow.bind(null, s_id));
    let ct_date = {..._time[shiftIdx].ct_date};
    ct_date[s_id] = (ct_date[s_id] || []).slice();
    for (let i=0; i<dates.length; i++) {
      let timestamp1 = Date.parse(new Date(dates[i].date));
      if (timestamp <= timestamp1 && ct_date[s_id].indexOf(dates[i].date) === -1) {
        ct_date[s_id].push(dates[i].date);
      }
    }

    _time[shiftIdx].ct_date = ct_date;
    setTime(_time);
    setCurrentRow();
  }

  const clearCurrentSelectCell  = (s_id, col_date, aShift, i) => {
    let _aShift = {...aShift};
    let ct_date = {..._aShift.ct_date};
    ct_date[s_id] = (ct_date[s_id] || []).slice();
    let index1 = ct_date[s_id].indexOf(col_date);
    if (index1 !== -1) {
      ct_date[s_id].splice(index1, 1);
    }
    if (ct_date[s_id].length==0) {
      delete ct_date[s_id];
    }
    _aShift.ct_date = ct_date;
    return _aShift;
  }

  const onSelectCell = (s_id, col_date, shiftIdx) => {
    let _time = time.map(clearCurrentSelectCell.bind(null, s_id, col_date));
    let ct_date = {..._time[shiftIdx].ct_date};
    ct_date[s_id] = (ct_date[s_id] || []).slice();
    ct_date[s_id].push(col_date);

    _time[shiftIdx].ct_date = ct_date;
    setTime(_time);
    setCurrentRow();
    setCurrentCol();
  }

  const onClickCol = (col, ev) => {
    setCurrentRow();
    setCurrentCol(col);
    const {width, height, x, y} = ev.currentTarget.getBoundingClientRect();
    setStoneStyle({width, height, left: x, top: y});
  }

  const onClickRow = (row, ev) => {
    setCurrentRow(row);
    setCurrentCol();
    const {width, height, x, y} = ev.currentTarget.getBoundingClientRect();
    setStoneStyle({width, height, left: x, top: y});
  }

  const onClickCell = (row, col, ev) => {
    setCurrentRow(row);
    setCurrentCol(col);
    const {width, height, x, y} = ev.currentTarget.getBoundingClientRect();
    setStoneStyle({width, height, left: x, top: y});
  }

  let columns = dates.map((col, i) => ({
    title: () => {
      let timestamp = Date.parse(new Date());
      let timestamp1 = Date.parse(new Date(col.date));
      return (
        <div className={timestamp > timestamp1 ? "" : "pointer"} onClick={timestamp > timestamp1 ? null : ev => onClickCol(col.date, ev)}>
          <span>{col.date.substring(col.date.length-2)}</span>
          <span>{col.week}</span>
        </div>
      )
    },
    dataIndex: col.date,
    onCell: (record, rowIndex) => (
      {className: record.arePast[i] ? "schedulingTimeNone" : (record.isStatisticsRow ? "" : "pointer")}
    ),
    render: (text, record, index) => {
      let timestamp = Date.parse(new Date());
      let timestamp1 = Date.parse(new Date(col.date));
      if (timestamp > timestamp1 || record.isStatisticsRow) {
        return text;
      } else {
        return <div onClick={ev => onClickCell(record.s_id, col.date, ev)}>
          {text}
        </div>
      }
    }
  }));
  columns.unshift({
    title: "",
    dataIndex: "s_name",
    render: (text, record, index) => {
      if (record.isStatisticsRow) {
        return text
      }

      return (
        <div className="pointer" onClick={ev => onClickRow(record.s_id, ev)}>
          {text}
        </div>
      )
    }
  });

  let dataSource = staff && staff.map((person, i) => {
    let {s_id} = person;
    let row = {s_id, s_name: person.s_name, arePast: []};
    let timestamp = Date.parse(new Date());

    for (let j=0; j<dates.length; j++) {
      let status = " ";
      for(let m in time) {
        let ct_name = time[m].ct_name;
        let name = ct_name.substring(0,1)
        let ct_date = time[m].ct_date;
        let ct_date_s_id = ct_date[s_id];
        for(let n in ct_date_s_id) {
          let date = ct_date_s_id[n];
          if(dates[j].date==date) {
            status = <span style={{"borderBottom":"2px solid "+time[m].color}}>{name}</span>
          }
        }
      }
      let timestamp1 = Date.parse(new Date(dates[j].date));
      let isPast = timestamp > timestamp1;
      row.arePast.push(isPast);
      row[dates[j].date] = <div>{status}</div>;
    }
    return row;
  })

  if (staff) {
    dataSource = dataSource.concat(time.filter(shift => !shift.holiday).map((shift, i) => {
      let label = <div>
        <div className="addSchedulingImg" style={{"background": shift.color}}></div>
        {shift.ct_name}
      </div>
      let row = {s_id: shift.ct_name, s_name: label, arePast: [], isStatisticsRow: true};
      for (let j=0; j<dates.length; j++) {
        let num = [];
        let date = dates[j].date;
        let ct_date = shift.ct_date;
        for(let key in ct_date) {
          let index1 = ct_date[key].indexOf(date);
          if(index1!="-1") {
            num.push(date)
          }
        }

        let number = num.length;
        if(number == 0) {
          number = " ";
        }
        row[dates[j].date] = <div>{number}</div>;
      }
      return row; 
    }))
  }

  const applyImport = (data) => {
    setDisplayUpload(false);
    let dataMonth;
    if (data[0]) {
      for (let n in data[0].date) {
        let dateToExtract = data[0].date[n][0];
        if (dateToExtract) {
          dataMonth = dateToExtract.slice(0, 7); //"2019-09"
        } 
      }
    }
    let newTime = time.map((item, i) => {
      let dataIndex;
      if (data[i] && item.ct_name === data[i].name) {
        dataIndex = i;
      } else {
        for (let j=0;j<data.length;j++) {
          if (data[j] && item.ct_name === data[j].name) {
            dataIndex = j;
            break;
          }
        }
      }

      if (hasVal(dataIndex)) {
        // keep ct_date, except the imported month.
        for (let user in item.ct_date) {
          let dataRecord = data[dataIndex].date[user];
          item.ct_date[user] = item.ct_date[user].filter((oneDate, m) => {
            return oneDate.slice(0,7) !== dataMonth;
          });
          if (!item.ct_date[user][0]) {
            delete item.ct_date[user];
          }
          
          item.ct_date[user] = (item.ct_date[user] || []).concat(dataRecord || []);
          delete data[dataIndex].date[user];
        }
        // add those users existing only in "date"
        item.ct_date = Object.assign({}, item.ct_date, data[dataIndex].date);
      } else {
        for (let user2 in item.ct_date) {
          item.ct_date[user2] = item.ct_date[user2].filter((oneDate, m) => {
            return oneDate.slice(0,7) !== dataMonth;
          });
          if (!item.ct_date[user2][0]) {
            delete item.ct_date[user2];
          }
        }
      }
      return item;
    });
    setTime(newTime);
  }

  return <>
    <ModalWithApi
      maskClosable={false}
      title="编辑排班"
      visible={props.visible}
      okText="确认"
      onOk={onOk}
      onCancel={closePopup}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 rule-popup edit-scheduling"
      width={1400}
    >
      <ListenerComponent closeCellOrRowPopover={closeCellOrRowPopover}/>

      <Popover
        key={`${currentRow}_${currentCol}`}
        content={popoverTriage}
        title="班次选择"
        overlayClassName="padding-free"
        visible={currentRow || currentCol}
      >
        {(currentRow || currentCol) && <div className="stone" style={stoneStyle}/>}
      </Popover>

      <ScheduleUploadPopup
        // key={"b" + popupKey}
        visible={displayUpload}
        month={month}
        onCancel={() => {
          setDisplayUpload(false);
        }}
        applyImport={applyImport}
      />

      <div className="rule-inner">
        <div className="top">
          <div className="schedulingCalendar">
            <Button type="link" onClick={onChangeCalendar.bind(null,-1)}>＜</Button>
            <span>{quickYear}年{quickMonth}月</span>
            <Button type="link" onClick={onChangeCalendar.bind(null,+1)}>＞</Button>
          </div>
          <a href={extendUrl + "/index/Clock_Info/clockExport?month=" + month + "&data=" + exportQuery} download>
            <Button type="primary" size="large" className="oper-6" icon={<img src={icon4} />}>导出数据</Button>
          </a>
          <Button type="primary" size="large" className="oper-9" icon={<ImportOutlined />} onClick={() => setDisplayUpload(true)}>导入数据</Button>
        </div>
        <div>
          <ProTable
            rowKey="s_id"
            className="edit-scheduling-table"
            size="small"
            scroll={{
              x: '100%',
              y: window.innerHeight - 390,
            }}
            options={false}
            search={false}
            dataSource={staff && dataSource}
            columns={columns}
            pagination={false}
          />

        </div>
      </div>
    </ModalWithApi>
  </>
}

export default EditScheduling;