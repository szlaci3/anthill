import { useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import Highlighter from 'react-highlight-words';
import {Table} from 'antd';

let a = document.createElement('div');
a.style.overflow = "scroll";
document.body.appendChild(a);
let scrollbarWidth = a.offsetWidth - a.clientWidth;// scrollbarSize is 0, needs correction.
document.body.removeChild(a);

function RealTable(props) {
  const pageSizeFake = 50; /* It divides and multiplies back, so it works with any number. */
  const { pageMax } = props;

  useEffect(() => {
    let el = document.getElementsByClassName("ant-table-body");
    if (el[0]) {
      el[0].scrollTop = 0;
    }
  }, [props.pagination.current]);

  const renderPercentWithHighlight = (text) => {
    let myText = props.getSpecialCell(text);
    return renderWithHighlight(myText);
  }

  const renderWithHighlight = (text) => {
    return <Highlighter
      highlightStyle={{ backgroundColor: '#3884FF', color: '#fff', padding: 0 }}
      searchWords={props.loading ? [] : [props.search_keyword]}
      autoEscape
      textToHighlight={text || ''}
    />
  }

  let newColumns = props.columns.map((col, i) => {
    let render;
    if (props.specialCols && props.specialCols.includes(col.title || col.comment)) {
      render = renderPercentWithHighlight;
    } else {
      render = renderWithHighlight;
    }
    return {...col, render};
  })

  const renderTable = () => {
    return <Table
      {...props}
      columns={newColumns}
      pagination={false}
    />
  };

  return (
    <ProTable
      {...props}
      pagination={{
        ...props.pagination,
        total: pageMax * pageSizeFake,
        pageSize: pageSizeFake,
      }}
      components={{
        body: renderTable,
      }}
      /* remove duplicates present in <Table> : */
      showHeader={false}
      loading={false}
    />
  );
}

export default RealTable;