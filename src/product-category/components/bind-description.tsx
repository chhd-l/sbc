import React, { Component } from 'react';
import { Modal, Button, Table, message } from 'antd';
import { Const } from 'qmkit';

import SearchForm from './../../description-management/components/search-form';
import { getDescriptionList } from './../../description-management/webapi';
import { bindDescription } from '../webapi';

import SortList from './sort-list';

interface Iprop {
  id: number;
  visible: boolean;
  defaultIds: Array<string>;
  onCloseModal: () => void;
}

export default class BindDescription extends Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      descName: '',
      selectedRowKeys: this.props.defaultIds,
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

  onCancel = () => {
    const { onCloseModal } = this.props;
    this.setState({
      selectedRowKeys: [],
      step: 1,
      loading: false,
      bindList: []
    });
    onCloseModal();
  };

  setDescName = (value: string) => {
    this.setState({
      descName: value
    });
  };

  getDescList = () => {
    const { defaultIds } = this.props;
    const { descName, pagination } = this.state;
    getDescriptionList({
      descriptionName: descName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    }).then((data) => {
      const { res } = data;
      if ((res.code = Const.SUCCESS_CODE)) {
        this.setState({
          descList: res.context.descriptionList,
          bindList: res.context.descriptionList.filter((d) => defaultIds.includes(d.id))
        });
      }
    });
  };

  onSelectRowChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
      bindList: []
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
    const { descList, selectedRowKeys, bindList } = this.state;
    this.setState({
      bindList: bindList.length > 0 ? bindList : descList.filter((d) => selectedRowKeys.includes(d.id)),
      step: 2
    });
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

  onSubmit = () => {
    const { id } = this.props;
    const { bindList } = this.state;
    this.setState({
      loading: true
    });
    bindDescription({
      goodsCateId: id,
      descriptionIdList: bindList.map((item) => item.id)
    })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.onCancel();
          message.success(res.message || 'Operate successfully');
        } else {
          message.error(res.message || 'Operate failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Operate failed');
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { visible } = this.props;
    const { descName, loading, selectedRowKeys, descList, step, pagination, bindList } = this.state;
    const listColumns = [
      {
        title: 'Description name',
        dataIndex: 'descriptionName',
        key: 'descName'
      },
      {
        title: 'Display name',
        key: 'dipName',
        render: (text, record) => <div>{record.translateList && record.translateList.length ? record.translateList[0]['translateName'] : ''}</div>
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
        maskClosable={false}
        onCancel={() => {
          this.onCancel();
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
              this.onCancel();
            }}
          >
            Cancel
          </Button>,
          step === 2 ? (
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => {
                this.onSubmit();
              }}
            >
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
