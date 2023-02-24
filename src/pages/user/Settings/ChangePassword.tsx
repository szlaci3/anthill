import { Progress, Card, Form, Input, notification, Button } from 'antd';
import { history } from 'umi';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { checkPassword, savePassword } from './service';

let interval;
let countdown = 6;

function ChangePassword(props) {
  const [form] = Form.useForm();
  const [original_password, setOriginal_password] = useState('');
  const [new_password, setNew_password] = useState('');
  const [repeat_password, setRepeat_password] = useState('');
  const [error_original_password, setError_original_password] = useState(null);
  const [error_new_password, setError_new_password] = useState(null);
  const [error_repeat_password, setError_repeat_password] = useState(null);
  const [eligibleToSave, setEligibleToSave] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  let strength;
  const colors = [
    "",
    'red',
    '#FFA800',
    'green',
  ];

  const ratio = {
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
  };

  const iconRender = visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />);

  const handleOriginal = (ev) => {
    ev.target.onblur = async (blurEvent) => {
      if (blurEvent.target.value.trim() === "") {
        setOriginal_password(null); 
        setError_original_password("请输入密码");
        return;
      }
      let res = await checkPassword({oldPassword: blurEvent.target.value});
      if (res.status == 0) {
        setOriginal_password(null);
        setError_original_password(res.info);
      } else {
        setOriginal_password(blurEvent.target.value);
        setError_original_password(null);
        analyze(blurEvent.target.value, new_password, repeat_password);
      }
    }
  }

  const handleOriginalPasswordKeyDown = (ev) => {
    handleOriginal(ev);
  }

  const handleChangeOriginal = (ev) => {
    handleOriginal(ev); // because of Chrome autofill
  }

  const handleChangeNew = (changeEvent) => {
    // 2 different handleChange functions, because of analyze
    if (changeEvent.target.value.trim() === "") {
      setError_new_password("请输入密码");
    } else {
      setError_new_password(null);
      setNew_password(changeEvent.target.value);
      analyze(original_password, changeEvent.target.value, repeat_password);
    }
    changeEvent.target.onblur = (blurEvent) => {
      if (blurEvent.target.value.length < 6) {
        setError_new_password("密码必须大于等于6个字符");
      }
    };
  }

  const handleChangeRepeat = (changeEvent) => {
    if (changeEvent.target.value.trim() === "") {
      setError_repeat_password("请输入密码");
    } else {
      setError_repeat_password(null);
      setRepeat_password(changeEvent.target.value);
      analyze(original_password, new_password, changeEvent.target.value);
    }
  }

  const analyze = (oldP, newP, repeatP) => {
    if (newP === oldP) {
      setError_new_password("新密码不能与旧密码相同");
    }
    if (oldP && repeatP && newP.length >= 6 && repeatP.length >= newP.length && !error_new_password) {
      if (newP !== repeatP) {
        setError_repeat_password("两次密码输入不一致");
      } else {
        setError_repeat_password(null);
        setEligibleToSave(true);
      }
    } else {
      setEligibleToSave(false);
    }
  }

  const handleChange = (setter, ev) => {
    eval(setter)(ev.target.value);
  }

  const getStrength = () => {
    let password = new_password;
    let score = 0;
    let kinds = 0;
    if (password) {
      kinds += password.match(/(?=.*[a-z])/) ? 1 : 0;
      kinds += password.match(/(?=.*[A-Z])/) ? 1 : 0;
      kinds += password.match(/(?=.*[0-9])/) ? 1 : 0;
      kinds += password.match(/(?=.*[!?@#$&_=%*])/) ? 1 : 0;
      score = Math.min(24, password.length * 3);
      score = Math.max(score, Math.min(32, kinds * password.length));
      score = (kinds >= 3 && password.length >= 8) ? 60 : score;//4 8, 3 9
      score = (kinds == 3 && password.length == 8) ? 40 : score;//3 8
      score = (kinds > 3 && password.length > 8) ? 90 : score;//4 9
      score = (kinds > 3 && password.length > 9) ? 100 : score;//4 10
      score = Math.min(100, score);
    }
    return score;
  }

  strength = getStrength();

  const send = async () => {
    setIsSaveLoading(true);
    const res = await savePassword({password: new_password, repassword: repeat_password});
    setIsSaveLoading(false);
    const key = `open${Date.now()}`;

    const renderSuccess = () => {
      notification.success({
        message: <span>恭喜你，修改密码成功！</span>,
        description: `${--countdown}秒后自动返回`,
        key,
        duration: 5,
        onClose: () => {
          notification.close(key);
          window.clearInterval(interval);
          countdown = 6;
        },
        btn: (<Button type="primary" size="small" onClick={closeSuccess}>
          返回
        </Button>),
      });
    }

    const closeSuccess = () => {
      history.push("/company-setup");
      notification.close(key);
      window.clearInterval(interval);
      countdown = 6;
    }

    if (res.status == 1) {
      interval = window.setInterval(() => {
        renderSuccess();
        if (countdown < 1) {
          closeSuccess();
        }
      }, 1000);
      renderSuccess();
    } else {
      setError_repeat_password(res.info);
    }
  }


  return <div className="" >
    <Card className="top-section">
      <div className="t1">更改密码</div>
      <div className="edit-btns">
        <Button className="tall oper-1 btn-negative" onClick={() => history.push("/company-setup")}>
          取消
        </Button>
        <Button type="primary" className="tall oper-1" loading={isSaveLoading} onClick={send} disabled={!eligibleToSave}>
          保存
        </Button>
      </div>

    </Card>

    <Card className="change-password ice-card">
      <Form form={form} colon={false} className="company-form" {...ratio} labelAlign="left">
        <Form.Item
          label="原密码"
          onKeyDown={handleOriginalPasswordKeyDown}
          onChange={handleChangeOriginal}
          className={error_original_password && "ant-form-item-with-help ant-form-item-has-error"}>
          <Input.Password
            iconRender={iconRender}
            allowClear
            autoFocus
          />
          {error_original_password && <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{error_original_password}</div></div>}
        </Form.Item>

        <Form.Item
          label="新密码"
          onChange={handleChangeNew}
          className={error_new_password && "ant-form-item-with-help ant-form-item-has-error"}>
          <Input.Password
            iconRender={iconRender}
            allowClear
          />
          {error_new_password && <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{error_new_password}</div></div>}
        </Form.Item>

        <Form.Item
          label="再次输入新密码"
          onChange={handleChangeRepeat}
          className={error_repeat_password && "ant-form-item-with-help ant-form-item-has-error"}>
          <Input.Password
            iconRender={iconRender}
            allowClear
          />
          {error_repeat_password && <div className="ant-form-item-explain ant-form-item-explain-connected"><div className="ant-form-item-explain-error">{error_repeat_password}</div></div>}
        </Form.Item>

        <Form.Item
          label="新密码"
          rules={[{required: true}]}>
          <Progress
            strokeColor={colors[Math.ceil((strength - 1) / 33)]}
            percent={strength}
            showInfo={false}
            style={{
              width: "390px"
            }}
          />
          <div className="under-progress">
            <div>弱</div>
            <div>中</div>
            <div>强</div>
          </div>
        </Form.Item>
      </Form>



      <input type="password" name="a" className="display-none" /*This inexplicably disables autocomplete on fields 2 & 3 *//>

    </Card>
  </div>
}


export default ChangePassword;