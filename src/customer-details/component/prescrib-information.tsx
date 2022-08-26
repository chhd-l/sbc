import React from 'react';
import { Table, Popover, Input, Button, Tooltip, Popconfirm } from 'antd';
import { cache, Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getPrescriberList, editPrescriberId } from '../webapi';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import Prescriber from './prescriber';
import Radio from 'antd/es/radio';
import { bbox } from '@antv/x6/lib/util/dom/geom';
interface Iprop {
  customerAccount: string;
  customerId: string;
}
const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || '';

export default class PrescribInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      editLoading: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10
      },
      row: {},
      selectedRowKeys: [],
      showModer: false,
      editPrescriberId: ''
    };
  }
  setSelectedRowKeys(newSelectedRowKeys) {
    this.setState({
      selectedRowKeys: [...newSelectedRowKeys]
    });
  }
  defalutClick(id) {
    let params = {
      customerId: this.props.customerId,
      prescriberId: id
    };
    this.setState({
      loading: true
    });
    webapi
      .fetchUpdDefaultPrescriber(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getPrescriberList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  }
  componentDidMount() {
    this.getPrescriberList();
  }

  getPrescriberList = () => {
    webapi
      .fetchPrescriberList({
        customerId: this.props.customerId,
        pageSize: this.state.pagination.pageSize,
        pageNum: this.state.pagination.current - 1
      })
      .then((data) => {
        const { pagination } = this.state;
        this.setState({
          loading: false,
          list: (data.res.context.prescriberList ?? []).map((item) => ({
            ...item,
            newPrescriberId: item.prescriberId,
            editVisible: false
          })),
          pagination: {
            ...pagination,
            total: data.res.context.total
          },
          selectedRowKeys: data.res.context.prescriberIdList
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getPrescriberList()
    );
  };

  handleVisibleChange = (id, visible) => {
    const { list } = this.state;
    list.forEach((item) => {
      if (item.id === id) {
        item.editVisible = visible;
      }
    });
    this.setState({ list });
  };

  onChangeNewPrescriberId = (id, value) => {
    const { list } = this.state;
    list.forEach((item) => {
      if (item.id === id) {
        item.newPrescriberId = value;
      }
    });
    this.setState({ list });
  };

  onSavePrescriberId = (id) => {
    const prescriber = this.state.list.find((item) => item.id === id);
    this.setState({ editLoading: true });
    editPrescriberId({
      customerId: this.props.customerId,
      prescriberPrimaryKey: id,
      prescriberIdBefore: prescriber.prescriberId,
      prescriberIdAfter: prescriber.newPrescriberId
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          this.getPrescriberList();
        }
      })
      .finally(() => {
        this.setState({ editLoading: false });
      });
  };
  setShowModer = () => {
    this.setState({
      showModer: false
    });
  };
  openEditPage = (row, index) => {
    this.setState(
      {
        showModer: true
      },
      () => {
        let { prescriberId } = row;
        let idx = this.state.selectedRowKeys.indexOf(prescriberId);
        let selectedRowKey = this.state.selectedRowKeys;
        selectedRowKey.splice(idx, 1);
        this.setState({
          selectedRowKeys: selectedRowKey,
          editPrescriberId: prescriberId
        });
      }
    );

    // row.taggingType = row.taggingType ? row.taggingType : 'Text';
    // let taggingForm = {
    //   taggingName: row.taggingName,
    //   taggingType: row.taggingType,
    //   taggingFontColor: row.taggingFontColor,
    //   taggingFillColor: row.taggingFillColor,
    //   taggingImgUrl: row.taggingImgUrl,
    //   displayStatus: row.displayStatus,
    //   showPage: row.showPage ? row.showPage.split(',') : []
    // };
    // let images = [];
    // if (row.taggingImgUrl) {
    //   images.push(row.taggingImgUrl);
    // }
    // this.setState(
    //   {
    //     modalName: 'Edit tagging',
    //     visible: true,
    //     taggingForm,
    //     isEdit: true,
    //     currentEditTagging: row,
    //     loading: false,
    //     images: images
    //   },
    //   () => {
    //     this.setImageUrl(row.taggingImgUrl);
    //   }
    // );
  };
  deleteTagging = (id) => {
    let params = {
      customerId: this.props.customerId,
      prescriberId: id
    };
    this.setState({
      loading: true
    });
    webapi
      .fetchDeletePrescriber(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getPrescriberList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  render() {
    const { list, pagination, loading, editLoading } = this.state;
    const columns = [
      {
        title: RCi18n({ id: 'PetOwner.PrescriberID' }),
        dataIndex: 'prescriberId',
        key: 'id'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberName' }),
        dataIndex: 'prescriberName',
        key: 'name'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberPhone' }),
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberCity' }),
        dataIndex: 'primaryCity',
        key: 'city'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberType' }),
        dataIndex: 'prescriberType',
        key: 'type'
      },
      {
        title: RCi18n({ id: 'PetOwner.Default' }),
        dataIndex: 'prescriberDefault',
        key: 'default',
        render: (text, record, index) => {
          if (record.defaultFlag) {
            return (
              <div style={styles.default}>
                <FormattedMessage id="PetOwner.Default" />
              </div>
            );
          } else {
            return (
              <div style={{ paddingLeft: '1.5rem' }}>
                <Radio onClick={() => this.defalutClick(record.prescriberId)} />
              </div>
            );
          }
        }
      },
      {
        title: RCi18n({ id: 'Product.Operation' }),
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />}>
              <a
                style={styles.edit}
                onClick={() => this.openEditPage(record, index)}
                className="iconfont iconEdit"
              ></a>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={<FormattedMessage id="Product.sureDeleteThisItem" />}
              onConfirm={() => this.deleteTagging(record.prescriberId)}
              okText={<FormattedMessage id="Product.Confirm" />}
              cancelText={<FormattedMessage id="Product.Cancel" />}
            >
              <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <div>
        <Prescriber
          customerId={this.props.customerId}
          getPrescriberList={this.getPrescriberList}
          selectedRowKeys={this.state.selectedRowKeys}
          setSelectedRowKeys={this.setSelectedRowKeys}
          showModer={this.state.showModer}
          setShowModer={this.setShowModer}
          editPrescriberId={this.state.editPrescriberId}
        />
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  tableImage: {
    width: '60px',
    height: '60px',
    padding: '5px',
    border: '1px solid rgb(221, 221, 221)',
    background: 'rgb(255, 255, 255)'
  },
  default: {
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    color: 'rgb(226, 0, 26',
    border: '1px solid rgb(226, 0, 26',
    borderRadius: '2rem',
    padding: '5px',
    fontSize: '0.9rem'
  }
} as any;
