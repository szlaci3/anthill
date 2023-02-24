import { useState, useEffect } from 'react';
import { Modal, Button, Select, TimePicker, Checkbox } from 'antd';
import moment from 'moment';

const { Option } = Select;

function PunchTime(props) {
  const elasticTimeList = [{name:"0分钟", id: 0},{name:"5分钟", id: 5},{name:"10分钟", id: 10},{name:"20分钟", id: 20},{name:"30分钟", id: 30},{name:"40分钟", id: 40},{name:"50分钟", id: 50},{name:"60分钟", id: 60}];

  const [ct_week, setCt_week] = useState([]);
  const [ct_work_time, setCt_work_time] = useState([{start:"09:00", end:"17:00"}]);
  const [ct_elastic_time, setCt_elastic_time] = useState(0);
  const [ct_before, setCt_before] = useState(0);
  const [ct_ft_state, setCt_ft_state] = useState(0);

  useEffect(() => {
    if (props.visible && props.time[0]) {
      let _ct_work_time = props.time[0].ct_work_time.map(range => ({...range}));
      if (props.index) {
        _ct_work_time.push({start:"09:00", end:"17:00"});
      }

      setCt_week(props.time[0].ct_week.slice());
      setCt_work_time(_ct_work_time);
      setCt_elastic_time(props.time[0].ct_elastic_time);
      setCt_before(props.time[0].ct_before);
      setCt_ft_state(props.time[0].ct_ft_state);
    }
  }, [props.visible]);

  const addNewTime = () => {
    let work_time = ct_work_time.slice();
    work_time.push({start:"09:00", end:"17:00"});
    setCt_work_time(work_time);
  }

  const delTime = (index) => {
    let work_time = ct_work_time.slice();
    work_time.splice(index, 1);
    setCt_work_time(work_time);
  }

  const onTimeChange = (idx, startOrEnd, _, timeStr) => {
    let work_time = ct_work_time.slice();
    work_time[idx][startOrEnd] = timeStr;
    setCt_work_time(work_time);
  }

  const isElligible = () => {
    let bool = true;
    for (let i=0; i<ct_work_time.length; i++) {
      bool = bool && ct_work_time[i].start && ct_work_time[i].end;
    }
    return bool;
  }

  const getAddTime = () => {
    return ct_work_time.map((todo,i) => {
      let addBtn;
      let delBtn;
      if(i==ct_work_time.length-1&&i!=0) {
        addBtn = <Button type="link" size="small" onClick={addNewTime}>新增时段</Button>
        delBtn = <Button type="link" size="small" onClick={delTime.bind(null,i)}>删除</Button>
      }else if(i==ct_work_time.length-1&&i==0) {
        addBtn = <Button type="link" size="small" onClick={addNewTime}>新增时段</Button>
        delBtn = ""
      }else{
        addBtn = ""
        delBtn = <Button type="link" size="small" onClick={delTime.bind(null,i)}>删除</Button>
      }

      return(
        <div key={"punchTime_"+i} className="position-row-a">
          <label className="rule-title">打卡时间:</label>
          <span>上班</span>
          <div id={"working_"+i} className="inputDate">
            <TimePicker size="small" value={todo.start ? moment(todo.start, 'HH:mm') : null} format='HH:mm' onChange={onTimeChange.bind(null, i, "start")} placeholder={undefined}/>
          </div>
          <span>— &nbsp;&nbsp;下班</span>
          <div id={"workout_"+i} className="inputDate">
            <TimePicker size="small" value={todo.end ? moment(todo.end, 'HH:mm') : null} format='HH:mm' onChange={onTimeChange.bind(null, i, "end")} placeholder={undefined}/>
          </div>
          {delBtn}
          {addBtn}
        </div>
      )
    })
  }
  
  const eachOption = (todo,i) => (
    <Option key={i} value={todo.id}>{todo.name}</Option>
  )

  const handleSubmit = () => {
    let c_holiday = props.c_holiday;
    let params = {
      ct_week: ct_week,
      ct_work_time: ct_work_time,
      ct_elastic_time: ct_elastic_time,
      ct_before: ct_before,
      ct_ft_state: ct_ft_state,
      ct_date: [],
    };

    let time = [];
    time.push(params);
    if(ct_week.length==5||ct_week.length==7) {
      for(let i=1;i<=ct_week.length;i++) {
        let index = ct_week.indexOf(i.toString())
        if(index == "-1") {
          c_holiday = 0;
          break;
        }
      }
    }else{
      c_holiday = 0;
    }
    let punchTimeData = {
      time:time,
      c_holiday:c_holiday,
    }

    props.onOk(punchTimeData);
    props.close();
  }

  const onWeekdayChange = (weekdayNum) => {
    let week = ct_week.slice();
    let idx = week.indexOf(weekdayNum);
    if (idx === -1) {
      week.push(weekdayNum);
    } else {
      week.splice(idx, 1);
    }
    setCt_week(week);
  }

  const renderWeekList = () => {
    return props.weeklist.map((todo,i) => (
      <Checkbox checked={ct_week.indexOf(todo.id)!="-1"} onChange={onWeekdayChange.bind(null, todo.id)} key={"week2_"+i}>{todo.name}</Checkbox>
    ))
  }

  return <>
    <Modal
      maskClosable={false}
      title="打卡时间"
      visible={props.visible}
      okText="确认"
      okButtonProps={{disabled: !isElligible()}}
      onOk={handleSubmit}
      onCancel={props.close}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 max-height-modal rule-popup"
      width={800}
    >
      <div className="rule-inner">
        <div className="position-row-a">
          <label className="rule-title">工作日:</label>
          {renderWeekList()}
        </div>
        {getAddTime()}
        <div className="position-row-a">
          <label className="rule-title">弹性时间:</label>
          <Select size="small" value={ct_elastic_time} onChange={value => setCt_elastic_time(value)} placeholder="请选择">
            {elasticTimeList.map(eachOption)}
          </Select>
          <span> （允许迟到、早退的分钟数）</span>

        </div>
        <div className="position-row-a ruleSetup-limitTime">
          <label className="rule-title">打卡时间限制:</label>
          <Select size="small" value={ct_before} onChange={value => setCt_before(value)} placeholder="请选择">
            {props.limitTimeList.map(eachOption)}
          </Select>
          <span> （都能打上班卡）</span>
        </div>
        <div className="position-row-a">
          <label className="rule-title">下班:</label>
          <Checkbox checked={ct_ft_state === 1} onChange={(ev) => setCt_ft_state(ev.target.checked ? 1 : 0)}>
            下班不需要打卡
          </Checkbox>
        </div>
      </div>
    </Modal>
  </>
}

export default PunchTime;