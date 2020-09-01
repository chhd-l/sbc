import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import DragTable from '../components/dragTable';
import Detail from '../components/consent-detail';


const { Option } = Select;





@Relax
export default class StepConsent extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail'
    };
  }

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      dataList: any;

    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',

  };
  handleChange = (value)=> {
    console.log(`selected ${value}`);
  }

  pageChange = (e) => {
    this.setState({pageType : e})
  }

  render() {
    return <div className="consent">
      {
        this.state.pageType == 'List'?(<React.Fragment>
            <div className="consent-select space-between">
              <div className="consent-select-text">Category</div>
              <div className="consent-select-data space-between">
                <Select defaultValue="Prescriber" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="Prescriber">Prescriber</Option>
                  <Option value="value1">value1</Option>
                </Select>
                <Select defaultValue="English" style={{ width: 120 }} loading>
                  <Option value="English">English</Option>
                  <Option value="China">China</Option>
                </Select>
              </div>
            </div>
            <Button className="btn" type="primary" shape="round" icon="plus" onClick={() => this.pageChange('Detail')}>New consent</Button>
            <div className="consent-table">
              <DragTable/>
            </div>
          </React.Fragment>)
          : (<React.Fragment>
          <div onClick={() => this.pageChange('List')}>
            <div className="detail-title"><Icon type="left" /> Concent edit</div>
          </div>
            <Detail/>
          </React.Fragment>)
      }

    </div>
  }
}
