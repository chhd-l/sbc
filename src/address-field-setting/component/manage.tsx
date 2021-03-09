import React from 'react';
import { Headline } from 'qmkit';
import { Alert, Row, Col } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import DragField from './drag-field';
import DropField from './drop-field';

export default class Manage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      result: [
        {
          row: 1,
          col: 1,
          field: ''
        },
        {
          row: 1,
          col: 2,
          field: ''
        },
        {
          row: 2,
          col: 1,
          field: ''
        },
        {
          row: 2,
          col: 2,
          field: ''
        },
        {
          row: 3,
          col: 1,
          field: ''
        },
        {
          row: 3,
          col: 2,
          field: ''
        },
        {
          row: 4,
          col: 1,
          field: ''
        },
        {
          row: 4,
          col: 2,
          field: ''
        }
      ]
    };
  }

  onAddDragItem = (row: number, col: number, field: string) => {
    const { result } = this.state;
    const idx = result.findIndex((o) => o.row === row && o.col === col);
    if (result.findIndex((o) => o.field === field) > -1) {
      return;
    }
    if (idx > -1) {
      result[idx]['field'] = field;
    }
    this.setState({
      result: result
    });
  };

  onRemoveDragItem = (idx: number) => {
    const { result } = this.state;
    result[idx]['field'] = '';
    this.setState({
      result: result
    });
  };

  render() {
    const { result } = this.state;
    return (
      <div className="container-search">
        <Headline title="Address field setting / Manage field display" />
        <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
        <DragDropContextProvider backend={HTML5Backend}>
          <Row gutter={8}>
            <Col span={8}>
              <div>Select field</div>
              <div className="field-item-container">
                <DragField key="1" name="First name" onDragEnd={this.onAddDragItem} />
                <DragField key="2" name="Last name" onDragEnd={this.onAddDragItem} />
              </div>
            </Col>
            <Col span={16}>
              <div>Basic information</div>
              <Row className="display-field-item-container">
                {result.map((ro, idx) => (
                  <Col span={12} key={idx}>
                    <DropField result={result} row={ro.row} col={ro.col} field={ro.field}>
                      {ro.field && (
                        <>
                          <div className="display-field-drag-item">{ro.field}</div>
                          <i onClick={() => this.onRemoveDragItem(idx)} className="iconfont iconDelete"></i>
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
