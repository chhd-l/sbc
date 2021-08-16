import React from 'react';
import { Table, Input, Modal } from 'antd';
import { Const } from 'qmkit';
import { getCustomerList } from '../webapi';
import { FormattedMessage, injectIntl } from 'react-intl';

class CustomerList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      searchTxt: '',
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getCustomerList();
  }

  getCustomerList = () => {
    const { pagination, searchTxt } = this.state;
    this.setState({ loading: true });
    getCustomerList({
      email: searchTxt,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          this.setState({
            loading: false,
            list: data.res.context.detailResponseList,
            pagination: {
              ...pagination,
              total: data.res.context.total
            }
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onChangeSearchTxt = (e) => {
    this.setState({
      searchTxt: e.target.value
    });
  };

  onSearchMember = () => {
    const { pagination } = this.state;
    this.onTableChange({
      ...pagination,
      current: 1
    });
  };

  onTableChange = (pagination) => {
    this.setState(
      {
        selectedRowKeys: [],
        pagination: pagination
      },
      () => this.getCustomerList()
    );
  };

  onSelectRow = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  };

  onConfirmChoose = () => {
    this.props.onConfirm(this.state.list.find((co) => co.customerDetailId === this.state.selectedRowKeys[0]));
  };

  onCloseModal = () => {
    this.props.onClose();
  };

  render() {
    const columns = [
      {
        title: <FormattedMessage id="Order.offline.consumerName" />,
        dataIndex: 'customerName',
        key: 'd1'
      },
      {
        title: <FormattedMessage id="Order.offline.consumerEmail" />,
        dataIndex: 'email',
        key: 'd2'
      },
      {
        title: <FormattedMessage id="Order.offline.consumerPhone" />,
        dataIndex: 'contactPhone',
        key: 'd3'
      }
    ];
    const { visible } = this.props;
    const { loading, list, pagination, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectRow,
      getCheckboxProps: (record) => ({
        disabled: selectedRowKeys.length >= 1 && record.customerDetailId !== selectedRowKeys[0],
        name: record.customerName
      }),
      columnTitle: ' '
    };
    return (
      <Modal width={900} title={<FormattedMessage id="Order.offline.consumerInformation" />} visible={visible} okText={<FormattedMessage id="Order.btnConfirm" />} cancelText={<FormattedMessage id="Order.btnCancel" />} okButtonProps={{ disabled: selectedRowKeys.length === 0 }} onOk={this.onConfirmChoose} onCancel={this.onCloseModal}>
        <div style={{ marginBottom: 10 }}>
          <Input.Search placeholder={(window as any).RCi18n({id:'Order.offline.consumerEmail'})} onChange={this.onChangeSearchTxt} onSearch={this.onSearchMember} />
        </div>
        <Table
          rowKey="customerDetailId"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={this.onTableChange}
        />
      </Modal>
    );
  }
}

export default injectIntl(CustomerList);
