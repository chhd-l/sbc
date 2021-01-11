import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm } from 'antd';
import { IMap } from 'plume2';
import { List } from 'immutable';
import nodataImg from '/web_modules/qmkit/images/sys/no-data.jpg';
type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

@Relax
export default class CityList extends Component<any, any> {
  _rejectForm;
  state: {};

  props: {
    relaxProps?: {
      loading: boolean;
      cityList: TList;
      getCitysList: Function;
      newCityForm: Function;
      editCityForm: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    cityList: 'cityList',
    getCitysList: noop,
    newCityForm: noop,
    editCityForm: noop
  };
  componentDidMount() {
    const { getCitysList } = this.props.relaxProps;
    getCitysList();
  }
  editRow = (item) => {
    const { editCityForm } = this.props.relaxProps;
    editCityForm(item);
  };
  deleteRow = (item) => {};
  addCity = () => {
    const { newCityForm } = this.props.relaxProps;
    newCityForm();
  };

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((item, index) => {
        const country = item.get('country');
        const state = item.get('state');
        const city = item.get('city');
        const postCode = item.get('postCode');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={index}>
            <td style={{ wordBreak: 'break-all' }}>{country}</td>
            <td style={{ wordBreak: 'break-all' }}>{state}</td>
            <td style={{ wordBreak: 'break-all' }}>{city}</td>
            <td style={{ wordBreak: 'break-all' }}>{postCode}</td>
            <td>
              <Tooltip placement="top" title="Edit">
                <span
                  /*className="red mgl20"*/
                  style={{ color: 'red', paddingRight: 10, cursor: 'pointer' }}
                  onClick={() => this.editRow(item.toJS())}
                  className="iconfont iconEdit"
                >
                  {/*<FormattedMessage id="edit" />*/}
                </span>
              </Tooltip>
              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteRow(item.toJS())} okText="Confirm" cancelText="Cancel">
                <Tooltip placement="top" title="Delete">
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </td>
          </tr>
        );
      })
    );
  }
  render() {
    const { loading, cityList } = this.props.relaxProps;
    return (
      <div>
        <div>
          <Button type="primary" htmlType="submit" style={{ marginBottom: '10px' }} onClick={this.addCity}>
            Add City
          </Button>
        </div>
        {cityList.size > 0 ? (
          <div>
            <div className="ant-table-wrapper">
              <div className="ant-table ant-table-large ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-body">
                    <table
                      style={{
                        borderCollapse: 'separate',
                        borderSpacing: '0 1em'
                      }}
                    >
                      <thead className="ant-table-thead">
                        <tr>
                          <th style={{ width: '10%' }}>Country</th>
                          <th style={{ width: '10%' }}>State</th>
                          <th style={{ width: '10%' }}>City</th>
                          <th style={{ width: '10%' }}>Post code</th>
                          <th style={{ width: '10%' }}>Operation</th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">{this._renderContent(cityList)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ant-table-placeholder">
            <img src={nodataImg} width="80" className="no-data-img" />
          </div>
        )}
      </div>
    );
  }
}
