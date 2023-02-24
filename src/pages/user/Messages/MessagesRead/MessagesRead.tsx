import { useState, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Card, Input, Drawer, message, Spin, Modal } from 'antd';
import { toArrayIfPossible } from '@/utils/utils';
import VirtualTable from '@/components/VirtualTable';
import classNames from 'classnames';
import { getAllInform, getFnorItem } from './service';
import searchIcon from '@/img/编组_magnifier.svg';
import Highlighter from 'react-highlight-words';
import MessagesTabs from '../MessagesTabs';
import Slider from '@/components/Slider';
import xss from 'xss';

const { Search } = Input;

function MessagesRead() {
  const 
    rowKey = "column_0",
    api = getAllInform,
    formatResult = res => res,
    defaultParams = {page: 1, key: "所有消息"},
    toolBarButtons = [];
  const actionRef = useRef();
  const sliderRef = useRef();
  const [tableCols, setTableCols] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  let myTableCols: ProColumns<API.RuleListItem>[] = [];
  let myTableRows = [{[rowKey]: 0}]; //表格内容
  const [tableRows, setTableRows] = useState(myTableRows);
  const [paramsStatus, setParamsStatus] = useState(defaultParams);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState();
  const [msg, setMsg] = useState();
  const [lastIdObj, setLastIdObj] = useState(); // {id: 187}
  const [nextIdObj, setNextIdObj] = useState();
  const [carouselVisible, setCarouselVisible] = useState(false);
  
  let total = 0;

  const res = useRequest((params) => api({ ...params, ...paramsStatus, read: 1}),
    {
      refreshDeps: [paramsStatus, refreshCount],
      formatResult: formatResult || (res => res.data),
    }
  );

  const alterCols = cols => {
    const newCols = [{Field: "column_6", Comment: "Title"}];
    return newCols;
  }

  const refreshTable = () => {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(() => {
    if (res.data) {
      myTableRows = toArrayIfPossible(res.data.data);
      setTableRows(myTableRows);
      if (myTableRows.length === 0 && !paramsStatus.search_keyword) {
        message.warning("没有相关信息！");
      }
      if (!tableCols[0]) {
        let colKeys = Object.keys(res.data.cols);
        let cols = colKeys.map(item => ({
          Field: item,
          Comment: res.data.cols[item],
        }));

        cols = alterCols(cols);

        cols.forEach((val, idx) => {
          myTableCols.push({
            title: val.Comment,
            dataIndex: val.Field,
            key: val.Field,
            className: classNames(val.Field, "pointer"),
            sorter: false,
            hasColAction: true,
          });
        });

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
      ...paramsStatus,
      page: pagination.current,
    });
  })

  const onSearch = (searchVal) => {
    setParamsStatus({
      ...paramsStatus,
      page: 1,
      search_keyword: searchVal ? String(searchVal).trim() : "",
    });
  }

  if (!res.data && !res.loading) {
    return <div/>;
  }


  const loadMsg = async (idObj) => {
    setIsDrawerVisible(true);
    setDrawerLoading(true);
    let resItem = await getFnorItem(idObj);
    setDrawerLoading(false);
    setMsg(resItem.data);
    setLastIdObj(resItem.last_id);
    setNextIdObj(resItem.next_id);
    window.setTimeout(() => {
      let cell = document.getElementsByClassName("current-msg")[0];
      cell && cell.scrollIntoView({behavior: "smooth"});
    }, 100);
  }  

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    window.setTimeout(() => {setMsg()}, 300);
  }

  const getSpecialCell = ({ columnIndex, rowIndex, style, mergedColumns, rawData, search_keyword, rowHover, rowUnhover }) => {
    let text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex];
    let className = "cell-with-date";

    return (<div
      className={classNames(className, `virtual-table-cell vrow-${rowIndex}`, {
        'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
        'virtual-table-cell-first': columnIndex === 0,
        'vtc-odd': rowIndex % 2 === 1,
        'pointer': true,
        'current-msg': msg && msg.id == rawData[rowIndex].column_0,
      })}
      style={style}
      data-row={rowIndex}
      data-id={rawData[rowIndex][rowKey]}
      onMouseOver={rowHover}
      onMouseOut={rowUnhover}
      onClick={ev => loadMsg({id: rawData[rowIndex].column_0})}
      key={rowIndex}
    >
      <div className="date-of-message">
        {rawData[rowIndex].column_4}
      </div>
      <Highlighter
        highlightStyle={{ backgroundColor: '#3884FF', color: '#fff', padding: 0 }}
        searchWords={res.loading ? [] : [paramsStatus.search_keyword]}
        autoEscape
        textToHighlight={text}
      />
    </div>)
  }

  const openImage = idx => {
    setCarouselVisible(true);
    if (sliderRef.current) {
      sliderRef.current.goTo(idx, true);
    } else {
      window.setTimeout(() => sliderRef.current.goTo(idx, true), 50);
    }
  }

  const eachImageBox = (box, i) => (
    <div key={i}>
      <img className="uploaded-image" src={`${rootUrl}/${box}`} onClick={openImage.bind(null, i)}/>
    </div>
  )

  const eachCarouselImg = (box, i) => (
    <div key={i}>
      <img className="carousel-image" src={`${rootUrl}/${box}`}/>
    </div>
  )


  return (
    <MessagesTabs>
      <div className="messages-read">
        <div>
          <VirtualTable
            showHeader={false}
            headerTitle={""}
            rowClick={()=>{}/* defined in special cell instead */}
            actionRef={actionRef}
            className="look few-cols-table"
            scroll={{
              x: '100%',
              y: window.innerHeight - 324,
            }}
            loading={res.loading}
            rowKey={rowKey}
            columns={tableCols}
            specialCols={["Title"]}
            getSpecialCell={getSpecialCell}
            dataSource={tableRows}
            onChange={onChange}
            options={false}
            search={false}
            toolBarRender={() => [
              ...toolBarButtons,
              <Search size="large" placeholder="输入关键字" allowClear onSearch={onSearch} className='u-search' enterButton={<img alt="" src={searchIcon} />}/>
            ]}
            pageMax={res.data && res.data.page.max}
            pagination={{
              current: paramsStatus.page,
              showSizeChanger: false,
              position: ['bottomRight'],
              showTotal: false,
            }}
          />

          <Drawer
            title={<>
              <div className="inner">{!drawerLoading && msg && msg.title}</div>
              <div className="drawer-extra">
                <Button type="primary" onClick={ev => loadMsg(lastIdObj)} disabled={drawerLoading || !lastIdObj}>上一篇</Button>
                <Button type="primary" onClick={ev => loadMsg(nextIdObj)} disabled={drawerLoading || !nextIdObj}>下一篇</Button>
              </div>
            </>}
            placement="right"
            onClose={closeDrawer}
            visible={isDrawerVisible}
            getContainer={false}
            mask={false}
            className="message-drawer"
            width="70%"
          >
            {drawerLoading && <Spin size="large" className="spin1"/>}

            {!drawerLoading && msg && <>
              <div className="date-of-message">{msg.time}</div>
              <div className="text" dangerouslySetInnerHTML={{__html: xss(msg.content)}} />
              {msg.filepath && msg.filepath[0] && (
                <div className="image-line center">
                  {msg.filepath.map(eachImageBox)}

                  <Modal
                    maskClosable={false}
                    title=" "
                    visible={carouselVisible}
                    onCancel={() => {setCarouselVisible(false)}}
                    footer={null}
                    className="carousel-popup max-height-modal"
                    width="90vw"
                    closeIcon={<span className="close-x">&times;</span>}
                    >

                    <Slider sliderRef={sliderRef}>
                      {msg.filepath.map(eachCarouselImg)}
                    </Slider>
                  </Modal>
                </div>
              )}
            </>}
          </Drawer>
        </div>
      </div>
    </MessagesTabs>
  )
}

export default MessagesRead;