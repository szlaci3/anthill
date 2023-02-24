import { Tooltip } from 'antd';
import { useRequest } from 'umi';
import { deptData } from './service';
import Coat from './Coat';
import icon34 from '@/img/级别_level.svg';

function Department(props) {
  const structureRes = useRequest(() => deptData());

  const organizeRoot = (data) => {
    if (!data) {
      return [];
    }

    // make it compatible w prev-prev version, first item has any pid, had no meaning, but now it must be 0
    data[0].pid = "0";

    const root = {
      id: data[0].pid,
      pid: null,
      name: "root",
      sub: [],
      selected: false,
    };
        
    var empDir = {};
    empDir[root.id] = root;

    for(var i = 0; i < data.length; i++) {
      var emp = data[i];
      var id = emp.id;
      var pid = emp.pid;
      var name = emp.name;
      if (typeof empDir[pid] !== "undefined") {
        empDir[id] = {
          id: id,
          pid: pid,
          name: name,
          selected: props.department && props.department.name === name,
          sub: []
        };
        empDir[pid].sub.push(empDir[id]);
      }
    }
    return root;
  }

  const companyStructure  = organizeRoot(structureRes.data);

  return <div className={"structure-dropdown " + (props.className || "")} onClick={props.toggleDepartment}>
    <div className="coat">
      <div className={"shirt main-dep" + (props.visible ? " active" : "")}>
        <Tooltip title={props.department && props.department.name ? props.placeholder : null} className="header">
          <div>
            <div className="triangle-wrapper">
              <div className={"triangle-" + (props.visible ? "up" : "down")}/>
            </div>
            {props.className === "dep-filter" && <img src={icon34}/>}
            {props.department && props.department.name || props.placeholder}
          </div>
        </Tooltip>
        {companyStructure && props.visible && <div className="item">
          {companyStructure.sub[0] && <Coat depObj={companyStructure} selectDepartment={props.selectDepartment}/>}
        </div>}
      </div>
    </div>
    {props.className === "dep-filter" && <button className={"clear-insitute" + (props.department ? "" : " visibility-hidden")} onClick={props.clearDepartment}>×</button>}
  </div>
}

export default Department;