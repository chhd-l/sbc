import React, { Component } from 'react';
import { Modal, Spin, Table, Input, message } from 'antd';
import { Const, Headline } from 'qmkit';
import * as webapi from './../webapi';

const { Search } = Input;

export default class AddPetOwner extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: false,
      id: 0,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      keyword: '',
      petOwnerList: [],
      selectedRowKeys: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (props.visible !== state.visible) {
      return {
        visible: props.visible,
        id: props.tagId,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        keyword: '',
        selectedRowKeys: []
      };
    }

    return null;
  }
  componentDidMount() {}
  componentDidUpdate() {
    if (this.state.visible) {
      this.getPetOwnerList();
    }
  }
  getPetOwnerList = () => {
    const { pagination, keyword, id } = this.state;
    let params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,
      keyword: keyword,
      segmentId: id
    };
    webapi
      .getNotBindPetOwner(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  handleOk = () => {
    const { selectedRowKeys, id } = this.state;
    let params = {
      segmentId: id,
      customerIdList: selectedRowKeys
    };
    webapi
      .addPetOwnerBindTag(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.props.closeFunction(true);
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  handleCancel = () => {
    this.props.closeFunction(false);
  };

  onSearch = (value) => {
    this.setState(
      {
        keyword: value,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getPetOwnerList()
    );
  };

  render() {
    const { visible, loading, pagination, petOwnerList } = this.state;

    const columns = [
      {
        title: 'Pet Owner ID',
        dataIndex: 'petOwnerId',
        key: 'petOwnerId',
        width: '15%'
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: '10%'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        width: '10%'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '10%'
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '10%'
      },
      {
        title: 'Created',
        dataIndex: 'created',
        key: 'created',
        width: '10%'
      },
      {
        title: 'Pets Owned',
        dataIndex: 'petsOwned',
        key: 'petsOwned',
        width: '10%'
      },
      {
        title: 'Pet Age',
        dataIndex: 'Pet Age',
        key: 'Pet Age',
        width: '10%'
      }
    ];

    const rowSelection = {
      columnWidth: '3%',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };

    return (
      <div>
        <Modal title="Add new pet owner" width={1000} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Headline
            title={'Pet owner list (' + pagination.total + ')'}
            extra={
              <div>
                <Search placeholder="Please input keyword" onSearch={(value) => this.onSearch(value)} style={{ width: 200 }} />
              </div>
            }
          />
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <Table rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={petOwnerList}></Table>
          </Spin>
        </Modal>
      </div>
    );
  }
}
