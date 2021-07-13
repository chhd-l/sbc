import React from 'react';
import { Table, Popconfirm, message, Button, Tooltip } from 'antd';
import { getPaymentMethods, deleteCard } from '../webapi';
import { cache, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
interface Iprop {
  customerId: string;
  customerAccount:string
}

export default class PaymentList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: []
    };
  }

  componentDidMount() {
   this.getCardList();
  }

  getCardList = () => {
    this.setState({ loading: true });
    const {storeId}=JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA||'{}'))
    getPaymentMethods({
      customerId: this.props.customerId,
      storeId
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.sort((a, b) => b.isDefault - a.isDefault)
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  deleteCard = ({id,canDelFlag}) => {
    if(!canDelFlag){
      message.error(RCi18n({id:"PetOwner.cannotDeletePaymentCard"}));
      return
    }
    this.setState({ loading: true });
    const {storeId}=JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA||'{}'))
    deleteCard({storeId, id })
      .then((data) => {
      if(data.res.code==='K-100209'){
        message.error(data.res.message);
      }else{
        message.success(data.res.message);
        this.getCardList();
      }
   
      })
      .catch(() => {
        message.error(RCi18n({id:"PetOwner.Unsuccessful"}));
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { list, loading } = this.state;
    const customerId = this.props.customerId || '';
    const customerAccount = this.props.customerAccount || '';
    const columns = [
      {
        title: RCi18n({id:"PetOwner.CardNumber"}),
        dataIndex: 'lastFourDigits',
        key: 'cardno',
        render: (text, record) => <div>{text ? '**** **** **** ' + text : ''}</div>
      },
      {
        title: RCi18n({id:"PetOwner.CardType"}),
        dataIndex: 'paymentVendor',
        key: 'type'
      },
      {
        title: RCi18n({id:"PetOwner.CardHolder"}),
        dataIndex: 'holderName',
        key: 'holder'
      },
      {
        title: RCi18n({id:"PetOwner.EmailAddress"}),
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: RCi18n({id:"PetOwner.phoneNumber"}),
        dataIndex: 'phone',
        key: 'phoneNumber'
      },
      {
        title: RCi18n({id:"PetOwner.Operation"}),
        key: 'oper',
        render: (_, record) => (
          <Popconfirm placement="topRight" title={RCi18n({id:"PetOwner.DeleteThisItem"})} onConfirm={() => this.deleteCard(record)} okText={RCi18n({id:"PetOwner.Confirm"})} cancelText={RCi18n({id:"PetOwner.Cancel"})}>
            <Tooltip title={RCi18n({id:"PetOwner.Delete"})}>
              <Button type="link">
                <a className="iconfont iconDelete"></a>
              </Button>
            </Tooltip>
          </Popconfirm>
        )
      }
    ];

    return (
      <div>
        
        <Button type="primary">
          <Link to={`/credit-card/${customerId}/${customerAccount}`}>
        {RCi18n({id:'payment.add'})}
         </Link></Button>
        <Table
          rowKey="id"
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </div>
    );
  }
}
