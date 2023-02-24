import { Card } from 'antd';
import STabs from '@/components/STabs'; 
import { useRequest } from 'umi';
import { useState, useRef } from 'react';
import { Button } from 'antd';

import icon1 from '@/img/dep-right.svg';
import icon2 from '@/img/去左侧_to-left-2.svg';
import icon3 from '@/img/去左侧_to-left.svg';
import icon4 from '@/img/外部传输_external-transmission.svg';
 import icon5 from '@/img/展开菜单1_menu-unfold-one.svg';
import icon6 from '@/img/左-小_left-small-2.svg';
import icon7 from '@/img/左-小_left-small.svg';
import icon8 from '@/img/排序_sort-four.svg';
import icon9 from '@/img/下载3_download-three-2.svg';
import icon10 from '@/img/提醒_remind.svg';
import icon11 from '@/img/收起菜单1_menu-fold-one.svg';
import icon12 from '@/img/下载_download-four.svg';
import icon13 from '@/img/文件设置_file-settings.svg';
import icon14 from '@/img/人员_people.svg';
import icon15 from '@/img/人员调动_turn-around.svg';
import icon16 from '@/img/日历_calendar-thirty-two.svg';
import icon17 from '@/img/人群_peoples-two.svg';
 import icon18 from '@/img/日历_calendar-thirty.svg';
import icon19 from '@/img/传入_afferent.svg';
import icon20 from '@/img/时间_time.svg';
import icon21 from '@/img/关系图_chart-graph.svg';
import icon22 from '@/img/添加人群_people-plus-one.svg';
import icon23 from '@/img/关闭_close-one.svg';
import icon24 from '@/img/添加同级条目_add-item.svg';
import icon25 from '@/img/列表查看模式_view-grid-list.svg';
import icon26 from '@/img/添加用户_add-user.svg';
import icon27 from '@/img/删除_delete-one-2.svg';
import icon28 from '@/img/清除格式_clear-format.svg';
import icon29 from '@/img/删除_delete-one.svg';
import icon30 from '@/img/用户_user.svg';
import icon31 from '@/img/删除_delete-three-2.svg';
import icon32 from '@/img/电子签_dianziqian.svg';
import icon33 from '@/img/删除_delete-three.svg';
import icon34 from '@/img/级别_level.svg';
import icon35 from '@/img/删除_delete-three的副本.svg';
import icon36 from '@/img/编组_magnifier.svg';
import icon37 from '@/img/到期文件_file-date.svg';
import icon38 from '@/img/编辑_editor.svg';
import icon39 from '@/img/加载_loading.svg';
import icon40 from '@/img/表格_table-file.svg';
import icon41 from '@/img/印章_seal.svg';
import icon42 from '@/img/连接_connection.svg';
import icon43 from '@/img/去右侧_to-right-2.svg';
import icon44 from '@/img/错误_error.svg';
import icon45 from '@/img/去右侧_to-right.svg';
import icon46 from '@/img/鼠标_mouse-one.svg';
import icon47 from '@/img/external-2.svg';
import icon48 from '@/img/融资2_financing-two.svg';
import icon49 from '@/img/文件撤销1_file-withdrawal-one.svg';
import icon50 from '@/img/list-select.svg';
import icon51 from '@/img/financing-two-gr.svg';
import icon52 from '@/img/file-withdrawal-one-gr.svg';
import icon53 from '@/img/add-three-gr.svg';
import icon54 from '@/img/calculator.svg';
import icon55 from '@/img/doc-add.svg';
import icon56 from '@/img/newlybuild.svg';
import icon57 from '@/img/multi-rectangle.svg';
import icon58 from '@/img/编辑_editor-gr.svg';
import icon59 from '@/img/clear.svg';
import icon60 from '@/img/add-item.svg';
import icon61 from '@/img/add-subset.svg';



function OverviewDetails(props) {
  // console.log(props.location.state)

  const [durr, setDurr] = useState(0);
  let durrRef = useRef(durr);
  durrRef.current = durr;

  const list = <>
        1:<img alt="" src={icon1} />
        2:<img alt="" src={icon2} />
        3:<img alt="" src={icon3} />
        4:<img alt="" src={icon4} />
        5:<img alt="" src={icon5} />
        6:<img alt="" src={icon6} />
        7:<img alt="" src={icon7} />
        8:<img alt="" src={icon8} />
        9:<img alt="" src={icon9} />
        10:<img alt="" src={icon10} />
        11:<img alt="" src={icon11} />
        12:<img alt="" src={icon12} />
        13:<img alt="" src={icon13} />
        14:<img alt="" src={icon14} />
        15:<img alt="" src={icon15} />
        16:<img alt="" src={icon16} />
        17:<img alt="" src={icon17} />
        18:<img alt="" src={icon18} />
        19:<img alt="" src={icon19} />
        20:<img alt="" src={icon20} />
        21:<img alt="" src={icon21} />
        22:<img alt="" src={icon22} />
        23:<img alt="" src={icon23} />
        24:<img alt="" src={icon24} />
        25:<img alt="" src={icon25} />
        26:<img alt="" src={icon26} />
        27:<img alt="" src={icon27} />
        28:<img alt="" src={icon28} />
        29:<img alt="" src={icon29} />
        30:<img alt="" src={icon30} />
        31:<img alt="" src={icon31} />
        32:<img alt="" src={icon32} />
        33:<img alt="" src={icon33} />
        34:<img alt="" src={icon34} />
        35:<img alt="" src={icon35} />
        36:<img alt="" src={icon36} />
        37:<img alt="" src={icon37} />
        38:<img alt="" src={icon38} />
        39:<img alt="" src={icon39} />
        40:<img alt="" src={icon40} />
        41:<img alt="" src={icon41} />
        42:<img alt="" src={icon42} />
        43:<img alt="" src={icon43} />
        44:<img alt="" src={icon44} />
        45:<img alt="" src={icon45} />
        46:<img alt="" src={icon46} />
        47:<img alt="" src={icon47} />
        48:<img alt="" src={icon48} />
        49:<img alt="" src={icon49} />
        50:<img alt="" src={icon50} />
        51:<img alt="" src={icon51} />
        52:<img alt="" src={icon52} />
        53:<img alt="" src={icon53} />
        54:<img alt="" src={icon54} />
        55:<img alt="" src={icon55} />
        56:<img alt="" src={icon56} />
        57:<img alt="" src={icon57} />
        58:<img alt="" src={icon58} />
        59:<img alt="" src={icon59} />
        60:<img alt="" src={icon60} />
        61:<img alt="" src={icon61} />

  </>

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 

  return (
    <>
      <Button onClick={() => setDurr(durr + 1)}>Btn1 {durr}</Button>
      <Button onClick={async () => {
        console.log(durrRef.current)
        let r = await delay(3000);
        console.log("later:")
        console.log(durrRef.current)
      }}>Btn2</Button>
      
      <STabs
        tabs={[{
          name: "Tab1",
          content: <div>You are viewing 1</div>
        }, {
          name: "Tab2",
          content: <div>Now You are viewing 2</div>
        }]}/>
      <
      >
        <Card>
          {list}
        </Card>

        <Card style={{background: 'black', color: 'white'}}>
          {list}
        </Card>
      </>
    </>
  );
}

export default OverviewDetails;