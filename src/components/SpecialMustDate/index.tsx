import { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, TimePicker, Input } from 'antd';
import moment from 'moment';

let { TextArea } = Input;

function SpecialMustDate(props) {
  const [c_special_on, setC_special_on] = useState([{date: moment(), start: "09:00", end: "17:00"}]);
  const [c_special_on_reason, setC_special_on_reason] = useState("");

  useEffect(() => {
    if (props.visible && props.c_special_on[0]) {
      let special_on = props.c_special_on.map(range => ({...range, date: range.date ? moment(range.date) : null}));
      if (props.index) {
        special_on.push({date: moment(), start: "09:00", end: "17:00"});
      }

      setC_special_on(special_on);
      setC_special_on_reason(props.c_special_on_reason);
    }
  }, [props.visible]);

  const addNewTime = () => {
    let special_on = c_special_on.slice();
    special_on.push({date: moment(), start: "09:00", end: "17:00"});
    setC_special_on(special_on);
  }

  const delTime = (index) => {
    let special_on = c_special_on.slice();
    special_on.splice(index, 1);
    setC_special_on(special_on);
  }

  const onDateChange = (idx, dateMoment) => {
    let special_on = c_special_on.slice();
    special_on[idx].date = dateMoment;
    setC_special_on(special_on);
  }

  const onTimeChange = (idx, startOrEnd, _, timeStr) => {
    let special_on = c_special_on.slice();
    special_on[idx][startOrEnd] = timeStr;
    setC_special_on(special_on);
  }

  const getAddTime = () => {
    return c_special_on.map((todo,i) => {
      let addBtn;
      let delBtn;
      if(i==c_special_on.length-1&&i!=0) {
        addBtn = <Button type="link" size="small" onClick={addNewTime}>新增时段</Button>
        delBtn = <Button type="link" size="small" onClick={delTime.bind(null,i)}>删除</Button>
      }else if(i==c_special_on.length-1&&i==0) {
        addBtn = <Button type="link" size="small" onClick={addNewTime}>新增时段</Button>
        delBtn = ""
      }else{
        addBtn = ""
        delBtn = <Button type="link" size="small" onClick={delTime.bind(null,i)}>删除</Button>
      }

      return(
        <div key={i}>
          <div className="position-row-a">
            <label className="rule-title">日期:</label>
            <DatePicker
              size="small"
              className="chinese-date-picker"
              value={todo.date}
              onChange={onDateChange.bind(null, i)}
              format="YYYY年MM月DD日"
              allowClear={false}
            />
          </div>

          <div className="position-row-a">
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
        </div>
      )
    })
  }

  const onInputChange = ev => {
    setC_special_on_reason(ev.target.value);
  }


  const handleSubmit = () => {
    let params = {
      c_special_on: c_special_on.map(range => ({
        ...range,
        date: range.date.format("YYYY-MM-DD")
      })),
      c_special_on_reason,
    }

    props.onOk(params);
    props.close();
  }

  const isElligible = () => {
    let bool = true;
    for (let i=0; i<c_special_on.length; i++) {
      bool = bool && c_special_on[i].date;
    }
    return bool;
  }


  return <>
    <Modal
      maskClosable={false}
      title="特殊日期"
      visible={props.visible}
      okText="确认"
      onOk={handleSubmit}
      onCancel={props.close}
      okButtonProps={{disabled: !isElligible()}}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 max-height-modal rule-popup"
      width={800}
    >
      <div className="rule-inner">
        <div className="position-row-a">
          <label className="rule-title">打卡日期</label>
        </div>

        {getAddTime()}

        <div className="position-row-a">
          <label className="rule-title">事由:</label>
          <div className="special-reason">
            <TextArea size="small" autoSize={{ minRows: 3, maxRows: 4 }} value={c_special_on_reason} onChange={onInputChange} showCount maxLength={100}/>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default SpecialMustDate;