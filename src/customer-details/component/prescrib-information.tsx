import React from 'react';
import { Table, Popover, Input, Button } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getPrescriberList, editPrescriberId } from '../webapi';

interface Iprop {
  customerAccount: string;
  customerId: string;
}

export default class PrescribInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      editLoading: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getPrescriberList();
  }

  getPrescriberList = () => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getPrescriberList({
      customerAccount: this.props.customerAccount,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: (data.res.context?.content ?? []).map(item => ({ ...item, newPrescriberId: item.prescriberId, editVisible: false })),
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
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
    list.forEach(item => {
      if (item.id === id) {
        item.editVisible = visible;
      }
    });
    this.setState({ list });
  };

  onChangeNewPrescriberId = (id, value) => {
    const { list } = this.state;
    list.forEach(item => {
      if (item.id === id) {
        item.newPrescriberId = value;
      }
    });
    this.setState({ list });
  };

  onSavePrescriberId = (id) => {
    const prescriber = this.state.list.find(item => item.id === id);
    this.setState({ editLoading: true });
    editPrescriberId({
      customerId: this.props.customerId,
      prescriberPrimaryKey: id,
      prescriberIdBefore: prescriber.prescriberId,
      prescriberIdAfter: prescriber.newPrescriberId
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.getPrescriberList();
      }
    }).finally(() => {
      this.setState({ editLoading: false });
    })
  };

  render() {
    const { list, pagination, loading, editLoading } = this.state;
    const columns = [
      {
        title: RCi18n({id:"PetOwner.PrescriberID"}),
        dataIndex: 'prescriberId',
        key: 'id',
        render: (text, row) => (
          <div>
            <span style={{marginRight: 5}}>{text}</span>
            <Popover
              visible={row.editVisible}
              placement="right"
              content={
                <Input.Group compact style={{width: 320}}>
                  <Input style={{width:'70%'}} value={row.newPrescriberId} onChange={(e) => this.onChangeNewPrescriberId(row.id, e.target.value)} />
                  <Button type="primary" style={{width:'30%'}} loading={editLoading} onClick={() => this.onSavePrescriberId(row.id)}><FormattedMessage id="PetOwner.Save" /></Button>
                </Input.Group>
              }
              onVisibleChange={(visible) => this.handleVisibleChange(row.id, visible)}
              trigger="click"
            >
              <a className="iconfont iconEdit"></a>
            </Popover>
          </div>
        )
      },
      {
        title: RCi18n({id:"PetOwner.PrescriberName"}),
        dataIndex: 'prescriberName',
        key: 'name'
      },
      {
        title: RCi18n({id:"PetOwner.PrescriberPhone"}),
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: RCi18n({id:"PetOwner.PrescriberCity"}),
        dataIndex: 'primaryCity',
        key: 'city'
      },
      {
        title: RCi18n({id:"PetOwner.PrescriberType"}),
        dataIndex: 'prescriberType',
        key: 'type'
      }
    ];

    return (
      <div>
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
