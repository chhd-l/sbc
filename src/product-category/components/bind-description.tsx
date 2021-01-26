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
      step: 1,
      loading: false,
      bindList: []
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

  onNextButtonClick = () => {
    const { descList, selectedRowKeys } = this.state;
    const bindList = descList.filter((d) => selectedRowKeys.indexOf(d.id) > -1);
    this.setState({ bindList, step: 2 });
  };

  onPrevButtonClick = () => {
    this.setState({ step: 1 });
  };

  onDragSortEnd = (sortList) => {
    console.log(sortList);
    this.setState({
      bindList: sortList
    });
  };

  onDeleteItem = (idx: number) => {
    const { bindList } = this.state;
    bindList.splice(idx, 1);
    this.setState({
      bindList
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
          step === 2 ? (
            <Button key="prev" onClick={this.onPrevButtonClick}>
              Previous
            </Button>
          ) : null,
          <Button
            key="back"
            onClick={() => {
              onCloseModal();
            }}
          >
            Cancel
          </Button>,
          step === 2 ? (
            <Button key="submit" type="primary" onClick={() => {}}>
              Confirm
            </Button>
          ) : (
            <Button key="next" type="primary" disabled={!selectedRowKeys.length} onClick={this.onNextButtonClick}>
              Next
            </Button>
          )
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
            <SortList dataList={bindList} onSortEnd={this.onDragSortEnd} onDeleteRow={this.onDeleteItem} />
          </div>
        )}
      </Modal>
    );
  }
}
