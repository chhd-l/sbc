import React, { Component } from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { noop, RCi18n } from 'qmkit';
import { Form, Button, Spin, Tooltip, Popconfirm, Switch } from 'antd';
import { Table, Divider, Tag } from 'antd';

import { IMap } from 'plume2';
import { List } from 'immutable';
import nodataImg from '../../../web_modules/qmkit/images/sys/no-data.jpg';

type TList = List<IMap>;
const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
} as any;

const columns = [
  {
    title: RCi18n({id: 'Setting.LogisticCompanyname'}),
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: RCi18n({id: 'Setting.LogisticCompanycode'}),
    dataIndex: 'companyCode',
    key: 'companyCode',
  },
  {
    title: RCi18n({id: 'Setting.Status'}),
    key: 'status',
    dataIndex: 'status',
    render: (text) => (
      <Switch defaultChecked={text == 1} checked={text == 1} disabled />
    )
  },
  {
    title: RCi18n({id: 'Setting.Operator'}),
    key: 'operator',
    render: (text, record) => (
      <span>
         <span
           style={{ color: '#e2001a', paddingRight: 10, cursor: 'pointer' }}
           onClick={() => this.editRow(record)}
           className="iconfont iconEdit"
         >
         </span>
         <span
           style={{ color: '#e2001a', paddingRight: 10, cursor: 'pointer' }}
           onClick={() => this.editRow(record)}
           className="iconfont iconDelete"
         >
         </span>
      </span>
    ),
  },
];

@Relax
export default class CompanyList extends Component<any, any> {
  _rejectForm;
  state: {
    storeId: 0;
  };

  props: {
    relaxProps?: {
      loading: boolean;
      tableDatas: TList;
      setModalVisible: Function;
      deleteRow: Function;
      resetForm: Function;
      addCompany: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    tableDatas: 'tableDatas',
    setModalVisible: noop,
    deleteRow: noop,
    getList: noop,
    resetForm: noop,
    addCompany: noop
  };
  handleTableChange() {}
  componentDidMount() {

  }
  deleteRow = ({ bannerId }) => {
    const { deleteRow } = this.props.relaxProps;
    deleteRow({ bannerId: bannerId });
  }

  editRow = () => {

  }
  render() {
    const { loading, tableDatas, setModalVisible, resetForm, addCompany } = this.props.relaxProps;
    const nodata = tableDatas.size === 0
    return (
      <div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: '10px', marginBottom: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              addCompany()
            }}
          >
            <FormattedMessage id="Setting.Addnewcompany" />
          </Button>
          {
            !loading ? !nodata ?
            <Table columns={columns} dataSource={tableDatas.toJS()} />:
              <div className="img-container"><img src={nodataImg} width="80" className="no-data-img" /></div> :
            <Spin className="loading-spin" indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" alt="" />} />
          }
        </div>
      </div>
    );
  }
}
