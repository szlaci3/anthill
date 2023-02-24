import { useState, useEffect } from 'react';
import { Modal, Button, Select, TimePicker, Checkbox, Input, Form } from 'antd';
import moment from 'moment';
import { hasVal } from '@/utils/utils';

const { Option } = Select;

function AddScheduling(props) {
  const elasticTimeList = [{name:"0分钟", id: 0},{name:"5分钟", id: 5},{name:"10分钟", id: 10},{name:"20分钟", id: 20},{name:"30分钟", id: 30},{name:"40分钟", id: 40},{name:"50分钟", id: 50},{name:"60分钟", id: 60}];

  const [startAndEnd, setStartAndEnd] = useState({start: "09:00", end: "17:00"});
  const [ct_name, setCt_name] = useState("");
  const [ct_ft_state, setCt_ft_state] = useState(0);
  const [ct_elastic_time, setCt_elastic_time] = useState(0);
  const [ct_before, setCt_before] = useState(0);
  const [inputError, setInputError] = useState();

  useEffect(() => {
    let {index} = props;
    if (props.visible) {
      if (hasVal(index)) {
        let _startAndEnd = {...props.time[index].ct_work_time[0]};
        setCt_ft_state(props.time[index].ct_ft_state);
        setCt_name(props.time[index].ct_name);
        setStartAndEnd(_startAndEnd);
        setCt_elastic_time(props.time[index].ct_elastic_time);
        setCt_before(props.time[index].ct_before);
      } else {
        setCt_ft_state(0);
        setCt_name("");
        setStartAndEnd({start: "09:00", end: "17:00"});
        setCt_elastic_time(0);
        setCt_before(0);
      }
    }
  }, [props.visible]);

  const onTimeChange = (startOrEnd, _, timeStr) => {
    let _startAndEnd = {...startAndEnd};
    _startAndEnd[startOrEnd] = timeStr;
    setStartAndEnd(_startAndEnd);
  }

  const getAddTime = () => (
    <div className="position-row-b">
      <label className="rule-title">打卡时间:</label>
      <span>上班</span>
      <div className="inputDate">
        <TimePicker size="small" value={startAndEnd.start ? moment(startAndEnd.start, 'HH:mm') : null} format='HH:mm' onChange={onTimeChange.bind(null, "start")} placeholder={undefined}/>
      </div>
      <span>— &nbsp;&nbsp;下班</span>
      <div className="inputDate">
        <TimePicker size="small" value={startAndEnd.end ? moment(startAndEnd.end, 'HH:mm') : null} format='HH:mm' onChange={onTimeChange.bind(null, "end")} placeholder={undefined}/>
      </div>
    </div>
  )
  
  const eachOption = (todo,i) => (
    <Option key={i} value={todo.id}>{todo.name}</Option>
  )

  const handleSubmit = () => {
    let params = {
      ct_name: ct_name,
      ct_work_time: [startAndEnd],
      ct_elastic_time: ct_elastic_time,
      ct_before: ct_before,
      ct_ft_state: ct_ft_state,
      ct_week: [],
    };

    let _time = props.time;
    if (hasVal(props.index)) {
      _time[props.index] = params;
    } else {
      _time.push(params);
    }
    let okData = {
      time: _time,
    };

    props.onOk(okData);
    props.close();
  }

  const onNameChange = ev => {
    let {value} = ev.target;
    setCt_name(value);
    let nameIsSame = false;
    for (let i=0;i<props.time.length;i++) {
      if (props.time[i].ct_name === value) {
        nameIsSame = true;
        break;
      }
    }

    if (!value) {
      setInputError("请输入打卡名称");
    } else if (value.length > 8) {
      setInputError("名称由1~8个中文、英文、数字组成");
    } else if (nameIsSame) {
      setInputError("已经存在该名称");
    } else {
      setInputError();
    }
  }

  return <>
    <Modal
      maskClosable={false}
      title="添加班次"
      visible={props.visible}
      okText="确认"
      okButtonProps={{disabled: !ct_name || inputError}}
      onOk={handleSubmit}
      onCancel={props.close}
      closeIcon={<span className="close-x">&times;</span>}
      className="left36 max-height-modal rule-popup"
      width={800}
    >
      <div className="rule-inner">
        <div className="position-row-c">
          <label className="rule-title">打卡名称:</label>
          <Form.Item className="ct-name">
            <Input size="small" value={ct_name} onChange={onNameChange} autoFocus={!hasVal(props.index)} className={inputError ? "ant-input-status-error" : ""}/>
            <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{inputError}</div></div>
          </Form.Item>
        </div>
        {getAddTime()}
        <div className="position-row-b">
          <label className="rule-title">弹性时间:</label>
          <Select size="small" value={ct_elastic_time} onChange={value => setCt_elastic_time(value)} placeholder="请选择">
            {elasticTimeList.map(eachOption)}
          </Select>
          <span> （允许迟到、早退的分钟数）</span>

        </div>
        <div className="position-row-b ruleSetup-limitTime">
          <label className="rule-title">打卡时间限制:</label>
          <Select size="small" value={ct_before} onChange={value => setCt_before(value)} placeholder="请选择">
            {props.limitTimeList.map(eachOption)}
          </Select>
          <span> （都能打上班卡）</span>
        </div>
        <div className="position-row-b">
          <label className="rule-title">下班:</label>
          <Checkbox checked={ct_ft_state === 1} onChange={(ev) => setCt_ft_state(ev.target.checked ? 1 : 0)}>
            下班不需要打卡
          </Checkbox>
        </div>
      </div>
    </Modal>
  </>
}

export default AddScheduling;