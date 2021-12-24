import React, { Component } from 'react';
import { Modal, Spin, Table, Input, message, Button } from 'antd';
import { Const, Headline } from 'qmkit';
import * as webapi from './../webapi';

const { Search } = Input;

export default class AddPetOwner extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      id: props.tagId,
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

  // static getDerivedStateFromProps(props, state) {
  //   // 当传入的值发生变化的时候，更新state
  //   if (props.visible !== state.visible) {
  //     return {
  //       visible: props.visible,
  //       id: props.tagId,
  //       pagination: {
  //         current: 1,
  //         pageSize: 10,
  //         total: 0
  //       },
  //       keyword: '',
  //       selectedRowKeys: []
  //     };
  //   }

  //   return null;
  // }
  componentDidMount() {
    this.getPetOwnerList();
  }
  componentDidUpdate() {}
  getPetOwnerList = () => {
    const { pagination, keyword, id } = this.state;
    let params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,
      keyword: keyword,
      segmentId: id
    };
    this.setState({
      loading: true
    });
    webapi
      .getNotBindPetOwner(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { pagination } = this.state;
          let petOwnerList = res.context.customerList;
          pagination.total = res.context.total;
          this.setState({
            loading: false,
            petOwnerList: petOwnerList,
            pagination
          });
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
          this.setState(
            {
              visible: false
            },
            () => {
              this.props.refreshFunction('');
            }
          );
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
    this.setState({
      visible: false
    });
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
  openModal = () => {
    this.setState(
      {
        visible: true,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        keyword: '',
        selectedRowKeys: []
      },
      () => {
        this.getPetOwnerList();
      }
    );
  };
  closeModal = (isRefresh) => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, loading, pagination, petOwnerList, keyword, selectedRowKeys } = this.state;

    const columns = [
      {
        title: 'Pet Owner ID',
        dataIndex: 'customerId',
        key: 'customerId',
        width: '15%'
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: '10%',
        render: (text, row) => {
          return <p>{row.customerDetail && row.customerDetail.firstName}</p>;
        }
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        width: '10%',
        render: (text, row) => {
          return <p>{row.customerDetail && row.customerDetail.lastName}</p>;
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '15%',
        render: (text, row) => {
          return <p>{row.customerDetail && row.customerDetail.email}</p>;
        }
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '10%',
        render: (text, row) => {
          return <p>{row.customerDetail && row.customerDetail.contactPhone}</p>;
        }
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
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      }
    };

    return (
      <div style={{ display: 'inline' }}>
        <Button type="primary" onClick={this.openModal}>
          <p>New</p>
        </Button>
        <Modal title="Add new pet owner" width={1000} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Headline
            title={'Pet owner list (' + pagination.total + ')'}
            extra={
              <div>
                <Search
                  placeholder="Please input keyword"
                  value={keyword}
                  onChange={(e) => {
                    let value = e.target.value;
                    this.setState({ keyword: value });
                  }}
                  onSearch={(value) => this.onSearch(value)}
                  style={{ width: 200 }}
                />
              </div>
            }
          />
          <Spin spinning={loading}>
            <Table rowKey="customerId" rowSelection={rowSelection} columns={columns} pagination={pagination} dataSource={petOwnerList}></Table>
          </Spin>
        </Modal>
      </div>
    );
  }
}
