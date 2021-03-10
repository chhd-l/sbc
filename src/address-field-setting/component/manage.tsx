import React from 'react';
import { Headline } from 'qmkit';
import { Alert, Row, Col } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import DragField from './drag-field';
import DropField from './drop-field';

const genContainerTable = (row: number, col: number) => {
  const arr = [];
  for (let i = 1; i <= row; i++) {
    for (let j = 1; j <= col; j++) {
      arr.push({ row: i, col: j, field: '' });
    }
  }
  return arr;
};

export default class Manage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      result: genContainerTable(10, 2)
    };
  }

  componentDidMount() {
    this.initRowAndColField();
  }

  initRowAndColField = () => {
    const { fieldList } = this.props;
    const { result } = this.state;
    result.forEach((item) => {
      const tar = fieldList.find((t) => t.pageRow === item.row && t.pageCol === item.col);
      if (tar) {
        item.field = tar.fieldName;
      }
    });
    this.setState({
      result: result
    });
  };

  onAddDragItem = (row: number, col: number, field: string) => {
    const { result } = this.state;
    if (result.findIndex((o) => o.field === field) > -1) {
      return;
    }
    const idx = result.findIndex((o) => o.row === row && o.col === col);
    if (idx > -1) {
      result[idx]['field'] = field;
    }
    const { onFieldChange, fieldList } = this.props;
    const fieldInFieldList = fieldList.find((o) => o.fieldName === field);
    if (fieldInFieldList) {
      onFieldChange(fieldInFieldList.id, { pageRow: row, pageCol: col });
    }
    this.setState({
      result: result
    });
  };

  onRemoveDragItem = (idx: number) => {
    const { result } = this.state;
    const { fieldList, onFieldChange } = this.props;
    const fieldInFieldList = fieldList.find((o) => o.fieldName === result[idx]['field']);
    if (fieldInFieldList) {
      onFieldChange(fieldInFieldList.id, { pageRow: 0, pageCol: 0 });
    }
    result[idx]['field'] = '';
    this.setState({
      result: result
    });
  };

  render() {
    const { result } = this.state;
    const { fieldList } = this.props;
    return (
      <div>
        <DragDropContextProvider backend={HTML5Backend}>
          <Row gutter={16}>
            <Col span={10}>
              <div>
                <span className="field-bar-title">Select field</span> <span>select the drag field to the specified position on the right</span>
              </div>
              <div className="field-item-container">
                {fieldList
                  .filter((item) => item.enableFlag === 1)
                  .map((field) => (
                    <DragField key={field.id} name={field.fieldName} onDragEnd={this.onAddDragItem} />
                  ))}
              </div>
            </Col>
            <Col span={14}>
              <div className="field-bar-title">Basic information</div>
              <Row className="display-field-item-container">
                {result.map((ro, idx) => (
                  <Col span={12} key={idx}>
                    <DropField result={result} row={ro.row} col={ro.col} field={ro.field}>
                      {ro.field && (
                        <>
                          <div className="display-field-drag-item">{ro.field}</div>
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              this.onRemoveDragItem(idx);
                            }}
                            className="iconfont iconDelete"
                          ></a>
                        </>
                      )}
                    </DropField>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </DragDropContextProvider>
      </div>
    );
  }
}
