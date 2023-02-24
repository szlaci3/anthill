import { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, TimePicker, Input } from 'antd';
import moment from 'moment';

let { TextArea } = Input;

function SpecialNoneedDate(props) {
  const [c_special_off, setC_special_off] = useState([moment()]);
  const [c_special_off_reason, setC_special_off_reason] = useState("");


  const [delayPassed, setDelayPassed] = useState();

  useEffect(() => {
    if (props.visible && props.c_special_off[0]) {
      let special_off = props.c_special_off.map(item => item ? moment(item) : null);
      if (props.index) {
        special_off.push(moment());
      }

      setC_special_off(special_off);
      setC_special_off_reason(props.c_special_off_reason);
    }
  }, [props.visible]);

  const addNewTime = () => {
    let special_off = c_special_off.slice();
    special_off.push(moment());
    setC_special_off(special_off);
  }

  const delTime = (index) => {
    let special_off = c_special_off.slice();
    special_off.splice(index, 1);
    setC_special_off(special_off);
  }

  const onDateChange = (idx, dateMoment) => {
    let special_off = c_special_off.slice();
    special_off[idx] = dateMoment;
    setC_special_off(special_off);
  }

  const getAddTime = () => {
    return c_special_off.map((todo,i) => {
      let addBtn;
      let delBtn;
      if(i==c_special_off.length-1&&i!=0) {
        addBtn = <Button type="link" size="small" onClick={addNewTime}>新增时段</Button>
        delBtn = <Button type="link" size="small" onClick={delTime.bind(null,i)}>删除</Button>
      }else if(i==c_special_off.length-1&&i==0) {
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
              value={todo}
              onChange={onDateChange.bind(null, i)}
              format="YYYY年MM月DD日"
              allowClear={false}
            />
            {delBtn}
            {addBtn}
          </div>
        </div>
      )
    })
  }

  const onInputChange = ev => {
    setC_special_off_reason(ev.target.value);
  }

  const handleSubmit = () => {
    let params = {
      c_special_off: c_special_off.map(item => item.format("YYYY-MM-DD")),
      c_special_off_reason,
    }

    props.onOk(params);
    props.close();
  }

  const isElligible = () => {
    let bool = true;
    for (let i=0; i<c_special_off.length; i++) {
      bool = bool && c_special_off[i];
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
          <label className="rule-title">不打卡日期</label>
        </div>

        {getAddTime()}

        <div className="position-row-a">
          <label className="rule-title">事由:</label>
          <div className="special-reason">
            <TextArea size="small" autoSize={{ minRows: 3, maxRows: 4 }} value={c_special_off_reason} onChange={onInputChange} showCount maxLength={100}/>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default SpecialNoneedDate;