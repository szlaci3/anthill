import SettingsTabs from './SettingsTabs';
import { useState, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Typography } from 'antd';
import { toArrayIfPossible } from '@/utils/utils';
import VirtualTable from '@/components/VirtualTable';
import classNames from 'classnames';
import { getList, relieveJurisdiction, invitation } from './service';
import icon56 from '@/img/newlybuild.svg';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ReimbursementChooser from '@/components/ReimbursementChooser';
import PermissionChooser from '@/components/PermissionChooser';
import ChargingNotice from '@/components/ChargingNotice';
import { useModel } from 'umi';

let {Text} = Typography;

function AccountAuthorization() {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const { vip } = currentUser;
  const 
    rowKey = "column_4",
    api = getList,
    formatResult = res => res.data,
    defaultParams = {sort_col: 'column_0', sort_type: 'asc', page: 1},
    toolBarButtons = [];
  const actionRef = useRef();
  const [tableCols, setTableCols] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [permissionRefreshCount, setPermissionRefreshCount] = useState(0);
  const [invitationRefreshCount, setInvitationRefreshCount] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  let totalWidthTemp = 0;
  let myTableCols: ProColumns<API.RuleListItem>[] = [];
  let myTableRows = [{[rowKey]: 0}]; //表格内容
  const [tableRows, setTableRows] = useState(myTableRows);
  const [paramsStatus, setParamsStatus] = useState(defaultParams);
  const [currentPerson, setCurrentPerson] = useState();

  const [idToUnbind, setIdToUnbind] = useState();
  const [isDisplayInvitation, setIsDisplayInvitation] = useState();
  const [isInvitationLoading, setIsInvitationLoading] = useState();
  const [m_default, setM_default] = useState();
  const [selectedItems, setSelectedItems] = useState();

  const res = useRequest((params) => api({ ...params, ...paramsStatus }),
    {
      refreshDeps: [paramsStatus, refreshCount],
      formatResult: formatResult,
    }
  );

  const alterCols = cols => {
    const newCols = [...cols.slice(0, 4), ...cols.slice(5), {Field: "column_open", Comment: "权限操作"}];
    return newCols;
  }

  useEffect(() => {
    if (res.data) {
      myTableRows = toArrayIfPossible(res.data.data);
      setTableRows(myTableRows);
      if (myTableRows.length === 0) {
        message.warning("暂无子账户邀请信息！");
      }
      if (!tableCols[0]) {
        let colKeys = Object.keys(res.data.cols);
        let cols = colKeys.map(item => ({
          Field: item,
          Comment: res.data.cols[item],
        }));

        cols = alterCols(cols);

        cols.forEach((val, idx) => {
          let sample = "";
          for (let i=0; i<myTableRows.length; i++) {
            sample = myTableRows[i][val.Field] || "";
            if (sample) {
              break;
            }
          }
          sample = String(sample);
          let w = val.Field === "column_open" ? 200 : Math.min(350, Math.max(73, val.Comment.length * 23 + 14, 8 + sample.length * (sample[0] > 0 || sample[0] <= 0 ? 9 : 16)));
          if (idx === 0 || idx === cols.length - 1) {
            w += 18;// last col reduced for scrollbar, counterbalance it.
          }
          let defaultSortOrder;
          if (defaultParams.sort_col === val.Field) {
            switch (defaultParams.sort_type) {
              case 'asc': defaultSortOrder = 'ascend'; break;
              case 'desc': defaultSortOrder = 'descend'; break;
            }
          }
          myTableCols.push({
            width: w,
            title: val.Comment,
            dataIndex: val.Field,
            key: val.Field,
            className: classNames(val.Field, {"cell-has-type-link-action": val.Field === "column_open"}),
            ellipsis: true,
            sorter: false,
            hasColAction: false,
          });
          totalWidthTemp = totalWidthTemp + w;
        });

        setTotalWidth(totalWidthTemp);
        setTableCols(myTableCols);
      }
    }
  }, [res.data]);

  const onChange = ((
    pagination,
    filters,
    sorter,
    // extra,
  ) => {
    setParamsStatus({
      page: pagination.current,
    });
  })

  if (!res.data && !res.loading) {
    return <div/>;
  }

  const unbind = async (id) => {
    let res = await relieveJurisdiction({id});
    if (res.code != 0) {
      setRefreshCount(refreshCount + 1);
    }
  }

  const openUnbound = (id) => {
    Modal.confirm({
      title: '解除绑定',
      icon: <ExclamationCircleOutlined />,
      width: 500,
      content: '该操作将会解除该用户的子账户权限，并且不会恢复！',
      okText: '确定',
      onOk: unbind.bind(null, id),
      cancelText: '取消',
    });
  }

  const sendInvitation = async (item) => {
    const id = String(item.id);

    setIsInvitationLoading(true);
    let res = await invitation({id});
    setIsInvitationLoading(false);
    if (res.code == 0) {
      Modal.info({
        title: '提示',
        content: (
          <div className="red-letters">{res.msg}</div>
        ),
        okText: "关闭",
        onOk() {},
      });
    } else {
      setIsDisplayInvitation(false);
      setRefreshCount(refreshCount + 1);
    }
  }

  const openPermission = (record) => {
    setPermissionRefreshCount(permissionRefreshCount + 1);
    setCurrentPerson(record);
  }

  const openInvitation = () => {
    setInvitationRefreshCount(invitationRefreshCount + 1);
    setIsDisplayInvitation(true);
  }

  const getSpecialCell = ({ columnIndex, rowIndex, style, mergedColumns, rawData, search_keyword, rowHover, rowUnhover }) => {
    let text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];
    let className = "";

    switch (mergedColumns[columnIndex].title) {
      case "权限状态": {
        let tooltip = <div className="item-names">
            {text && text.split(",").map((word, i) => <div key={i}>{word}</div>)}
          </div>
        text = text.replaceAll(",", "，");
        text = <Text style={{width: 'inherit', color: 'inherit', paddingRight: 20}} ellipsis={{tooltip}}>
            {text}
          </Text>
        break;
      }
      case "权限操作": {
        className = "has-type-link-action";
        text = <div>
            <Button type="link" onClick={openPermission.bind(null, rawData[rowIndex])}>编辑权限</Button>
            <Button type="link" onClick={openUnbound.bind(null, rawData[rowIndex].column_4)} disabled={!rawData[rowIndex].column_8}>解除绑定</Button>
          </div>
        break;
      }
    }

    return (<div
      className={classNames(className, `virtual-table-cell vrow-${rowIndex}`, {
        'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
        'virtual-table-cell-first': columnIndex === 0,
        'vtc-odd': rowIndex % 2 === 1,
      })}
      style={style}
      data-row={rowIndex}
      data-id={rawData[rowIndex][rowKey]}
      key={rowIndex}
    >
      {text}
    </div>)
  }

  if (vip == 0) {
    return (
      <SettingsTabs>
        <ChargingNotice
          isEmptyPage={true}
        />
      </SettingsTabs>
    )
  }

  return (
    <SettingsTabs>
      <ReimbursementChooser
        key={invitationRefreshCount}
        visible={isDisplayInvitation}
        m_default={m_default}
        topTitle="邀请员工绑定"
        topMessage="您一共可以邀请2名员工进行绑定"
        blueTitle="已邀请的员工"
        blackTitle="员工："
        close={() => setIsDisplayInvitation(false)}
        storeChosen={sendInvitation}
        confirmLoading={isInvitationLoading}
        selectedItems={selectedItems}
        okText="发送邀请短信"
      />

      <PermissionChooser
        key={`_${permissionRefreshCount}`}
        currentPerson={currentPerson}
        rowKey={rowKey}
        onClose={() => setCurrentPerson(null)}
        reloadList={() => setRefreshCount(refreshCount + 1)}
      />

      <VirtualTable
        headerTitle={
          <Button
            type="primary"
            className="tall oper-3"
            // icon={<img alt="" src={icon19} />}
            onClick={openInvitation}
          >
            邀请员工绑定
          </Button>
        }
        actionRef={actionRef}
        className="look"
        scroll={{
          x: '100vw',
          y: window.innerHeight - 372,
        }}
        loading={res.loading}
        rowKey={rowKey}
        columns={tableCols}
        specialCols={["权限状态", "权限操作"]}
        getSpecialCell={getSpecialCell}
        totalWidth={totalWidth}
        dataSource={tableRows}
        onChange={onChange}
        options={false}
        search={false}
        toolBarRender={() => [
          ...toolBarButtons,
        ]}
        pageMax={res.data && res.data.page.max}
        pagination={{
          current: paramsStatus.page,
          showSizeChanger: false,
          position: ['bottomRight'],
          showTotal: false,
        }}
      />
    </SettingsTabs>
  );
}

export default AccountAuthorization;