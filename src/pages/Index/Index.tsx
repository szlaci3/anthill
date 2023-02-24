import { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import { message, Card } from 'antd';
import { Link, history, useRequest, useModel } from 'umi';
import { connect } from 'dva';
import icon15 from '@/img/人员调动_turn-around.svg';
import icon32 from '@/img/电子签_dianziqian.svg';
import icon37 from '@/img/到期文件_file-date.svg';
import icon39 from '@/img/加载_loading.svg';
import { customerIndex, getStatistics, mawStaff, joinOutStaff, sbxzCostChange, companyStaffInfo } from './service';
import { hasVal } from '@/utils/utils';
import ChartInsuranceSalary from './ChartInsuranceSalary';
import ChartEmployment from './ChartEmployment';
import ChartDepartmentGender from './ChartDepartmentGender';
import Guide from '@/components/Guide';

function Index(props) {
  const { initialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { vip, cid } = currentUser;
  let index;

  const indexRes = useRequest(() => customerIndex(),
    {
      formatResult: res => res,
    }
  );

  const joinInvitations = useRequest(() => getStatistics());

  if (indexRes.data && indexRes.data.status !== 0) {
    index = indexRes.data;
  }

  let currentDate = new Date();
  let month = new Array(12)
  for (let i=-5;i<=11;i++) {
    if(i<=-1) {
      month[i]=13+i
    }else{
      month[i]=1+i
    }
    month[i]=month[i]+"月"
  }
  let monthday = currentDate.getMonth()

  const doForceVisible = (bool) => {
    let {dispatch} = props;
    dispatch({
      type: "global/setForceVisibleAvatarDropdown",
      payload: bool,
    });
  }


  return (
    <>
      <Guide callback={() => doForceVisible(true)} close={() => doForceVisible(false)}/>

      <Card className="top-section hello">
        <div className="hello2">
          <div>
            <div className="i1">HELLO !</div>
            <div className="i2">{currentUser.name}<span className="i3">欢迎回来…</span></div>
            <div/>
            {index && <div className="i4">企业在职人数<span className="number">{index.onjobCount}</span>人</div>}
          </div>
        </div>
        
        <div className="shortcuts">
          {index && <div>
            <Link to="/staff/employee/join" className="ant-btn-primary">
              <img alt="" src={icon39} />
              待审批入职
              <div className="number">{hasVal(joinInvitations.data) ? joinInvitations.data : "-"}</div>
            </Link>

            <a href={void(0)} onClick={() => {history.push("/staff/employee/overview", {filtrate: "contract_to_expire"})}} className="ant-btn-primary">
              <img alt="" src={icon37} />
              合同到期
              <div className="number">{hasVal(index.contract_to_expire) ? index.contract_to_expire : "-"}</div>
            </a>

            <a href={void(0)} onClick={() => {history.push("/staff/employee/overview", {filtrate: "unexecuted_contract"})}} className="ant-btn-primary">
              <img alt="" src={icon32} />
              合同待签订
              <div className="number">{hasVal(index.unexecuted_contract) ? index.unexecuted_contract : "-"}</div>
            </a>

            <a href={void(0)} onClick={() => {history.push("/staff/employee/overview", {filtrate: "contract_try_end"})}} className="ant-btn-primary">
              <img alt="" src={icon15} />
              待试用期转正
              <div className="number">{hasVal(index.contract_try_end) ? index.contract_try_end : "-"}</div>
            </a>
          </div>}
        </div>
      </Card>

      <div className="charts">
        <ChartInsuranceSalary month={month} monthday={monthday}/>
        <ChartEmployment month={month} monthday={monthday}/>
        <ChartDepartmentGender/>
      </div>
    </>
  );
};

export default connect(state => {
  return {
  };
})(Index);