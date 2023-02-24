import { useState } from 'react';
import { Radio, Card } from 'antd';
import { history } from 'umi';
import { ReactComponent as BackArrow } from '@/img/左-小_left-small.svg';

let a = document.createElement('div');
a.style.overflow = "scroll";
document.body.appendChild(a);
let scrollbarWidth = a.offsetWidth - a.clientWidth;// scrollbarSize is 0, needs correction.
document.body.removeChild(a);


function ChargingDetails(props) {
  const [isPinkOn, setIsPinkOn] = useState(false);

  const handleRadio = ev => {
    let val = eval(ev.target.value);
    setIsPinkOn(val);
  }

  return <div className="charging">
    <Card className="uppermost-section">
      <BackArrow className="back-arrow" onClick={history.goBack}/>
      <div className="t3">您可根据自身需求选择所需服务，更有尊享版本让您的工作锦上添花</div>
    </Card>
    
    <div className="tableless-page" style={{paddingRight: `${30 - scrollbarWidth}px`}}>
      <Card className="ice-card ice-margins">
        <div className="center line2">不同版本灵活满足不同企业个性需求！</div>
        <div className="center line3">【标准版-免费】</div>
        <div className="center line4">
          <img src={require("@/img/cirrcle.png")} alt="" className="cirrcle"/>
          <div className="phrase2">
            <div className="inner">
              <span className="text">尊享版-垂询电话</span>
              <img src={require("@/img/rring.png")} alt="" />
              <span className="number">13052027578</span>
            </div>
          </div>
        </div>
      </Card>
    
      <div className="charging-inner ice-card">
        <div className="upper-blue center">
          <Radio.Group onChange={handleRadio} value={String(isPinkOn)}>
            <Radio value="false">标准版</Radio>
            <Radio value="true">尊享版</Radio>
          </Radio.Group>
        </div>

        <div className={"mention" + (isPinkOn ? " open" : "")}>
          “<span className="pink">红色</span>”部分的功能代表尊享版在标准版基础上增加的内容
        </div>

        <div className={"structure structure-first canhide" + (isPinkOn ? " show-pink" : "")}>
          <div>
             考勤
          </div>
          <div className="sep">
          </div>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="pink">考勤预览/设置 考勤统计</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="pink">打卡规则设置 打卡趋势一览 员工考勤明细及统计数据</span></div>
            </div>
          </div>
        </div>

        <div className={"structure" + (isPinkOn ? " show-pink" : "")}>
          <div>
            员工管理
          </div>
          <div className="sep">
          </div>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="dark">员工信息总览 </span><span className="pink">员工合同管理 员工假期管理 </span><span className="dark">组织架构设置 </span><span className="pink">调岗记录</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="dark">单名/批量添加员工 自定义员工信息字段 员工信息数据导入、导出 员工信息维护 员工入、离职操作 </span><span className="pink">劳动合同信息维护及副本保存 试用期、劳动合同到期续签提醒 员工各类假期天数设置 历月员工休假数据汇总 历月员工请假明细 </span><span className="dark">组织架构设置 </span><span className="pink">调岗、调薪记录</span></div>
            </div>
          </div>

          <div>
            社保薪资管理
          </div>
          <div className="sep">
          </div>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="dark">社保管理 薪酬管理</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="dark">员工社保总览 历月社保查询 社保政策及基数设置 员工社保计算 导出社保数据 社保模拟计算 员工薪酬总览 历月薪酬数据查询 自定义薪酬计算公式 员工薪酬项目展示（开关） 薪酬数据批量导入/薪酬模板下载 员工薪酬计算 </span><span className="pink">工资单发布</span></div>
            </div>
          </div>

          <div>
            员工福利平台
          </div>
          <div className="sep">
          </div>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="dark">福利平台</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="dark">员工福利平台</span></div>
            </div>
          </div>

          <div>
            员工公告发布
          </div>
          <div className={isPinkOn ? "sep" : ""}>
          </div>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="dark">公告发布</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="dark">定向发布重要公告</span></div>
            </div>
          </div>
        </div>

        <div className={"structure canhide" + (isPinkOn ? " show-pink" : "")}>
          <div>
            审批管理
          </div>
          <div/>
          <img className="ball" src={require('@/img/reim1.png')}/>
          <div>
            <div>
              <div className="key">功能模块 — </div>
              <div className="value"><span className="pink">报销</span></div>
            </div>
            <div>
              <div className="key">包含功能：</div>
              <div className="value"><span className="pink">报销模板设置 自定义审批流程 报销记录明细</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default ChargingDetails;