import React, { Component } from 'react';
import { Modal, Button, Table } from 'antd';
import { Const } from 'qmkit';

import SearchForm from './../../description-management/components/search-form';
import { getDescriptionList } from './../../description-management/webapi';

import SortList from './sort-list';

interface Iprop {
  id: number;
  visible: boolean;
  onCloseModal: () => void;
}

export default class BindDescription extends Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      descName: '',
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      descList: [],
      step: 2,
      loading: false,
      bindList: [
        {
          id: 1,
          descName: 'Description',
          dipNameEn: 'Description_en',
          status: false
        },
        {
          id: 2,
          descName: 'entity',
          dipNameEn: 'entity_en',
          status: true
        },
        {
          id: 3,
          descName: 'thirdd',
          dipNameEn: 'thirdd_en',
          status: false
        }
      ]
    };
  }

  componentDidMount() {
    this.getDescList();
  }

  setDescName = (value: string) => {
    this.setState({
      descName: value
    });
  };

  getDescList = () => {
    const { descName, pagination } = this.state;
    getDescriptionList({
      descName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    }).then((res) => {
      if ((res.code = Const.SUCCESS_CODE)) {
        this.setState({
          descList: res.context.descList
        });
      }
    });
  };

  onSelectRowChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    });
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination
      },
      () => {
        this.getDescList();
      }
    );
  };

  onDragSortEnd = (sortList) => {
    console.log(sortList);
    this.setState({
      bindList: sortList
    });
  };

  render() {
    const { visible, onCloseModal } = this.props;
    const { descName, loading, selectedRowKeys, descList, step, pagination, bindList } = this.state;
    const listColumns = [
      {
        title: 'Description name',
        dataIndex: 'descName',
        key: 'descName'
      },
      {
        title: 'Display name',
        dataIndex: 'dipNameEn',
        key: 'dipNameEn'
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectRowChange
    };

    return (
      <Modal
        title="Bind description"
        visible={visible}
        width="800px"
        confirmLoading={loading}
        maskClosable={false}
        onCancel={() => {
          onCloseModal();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              onCloseModal();
            }}
          >
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={() => {}}>
            Confirm
          </Button>
        ]}
      >
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div className="filter-content">
                <SearchForm descName={descName} onChangeDescName={this.setDescName} onSearch={this.getDescList} />
              </div>
              <Button
                type="primary"
                onClick={() => {
                  this.onSelectRowChange([]);
                }}
                disabled={selectedRowKeys.length === 0}
              >
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{selectedRowKeys.length ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" onChange={this.handleTableChange} rowSelection={rowSelection} columns={listColumns} dataSource={descList} pagination={pagination} />
          </div>
        )}

        {step === 2 && (
          <div>
            <SortList dataList={bindList} onSortEnd={this.onDragSortEnd} />
          </div>
        )}
      </Modal>
    );
  }
}
