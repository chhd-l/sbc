import React, { Component } from 'react';
import './index.less';
import { AuthWrapper, BreadCrumb, RCi18n } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/list';
import { redirectionUrlDelByUrl, redirectionUrlQuery, redirectionUrlUpdByUrl } from './webapi';
import { message } from 'antd';

export default class OrderList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      SearchListloading: true,
      searchParams: {
        url: ''
      },
      dataSource: [
        {
          key: '1',
          url: '胡彦斌',
          redirection: 32,
          redirectionType: '302',
          status: 0
        },
        {
          key: '2',
          url: '胡彦祖',
          redirection: 42,
          redirectionType: '301',
          status: 1
        },
      ]
    }
  }

  componentDidMount() {
    this.init();
  }
  // 搜索
  onSearch = (searchParams) => {
    console.log('searchParams', searchParams)
    this.setState({
      searchParams: { ...searchParams }
    }, () => {
      // 执行查询方法
      this.init();
    })
  }
  // 查询方法
  init = () => {
    this.setState({
      SearchListloading: true
    })
    const { searchParams } = this.state;
    redirectionUrlQuery(searchParams).then((data) => {
      console.log('redirectionUrlQueryres', data.res);
      const { res } = data;
      this.setState({
        dataSource: res.context?.redirectionUrlVOList,
        SearchListloading: false
      })
    }).catch((err) => {
      this.setState({
        dataSource: [],
        SearchListloading: false
      })
    })
  }

  statusOnchange = (value, rowinfo) => {
    this.setState({
      SearchListloading: true
    }, () => {
      console.log('e', { value, rowinfo });
      let params = {
        ...rowinfo,
        status: value ? 1 : 0
      }
      redirectionUrlUpdByUrl(params).then((data) => {
        console.log('redirectionUrlUpdByUrl', data.res);
        if (data.res.code === 'K-000000') {
          message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }))
        } else {
          message.success(RCi18n({ id: 'PetOwner.Unsuccessful' }))
        }
      }).catch((err) => {

      }).finally(() => {
        this.init();
        this.setState({
          SearchListloading: false
        })
      })
    })
  }

  redirectionDel = (rowinfo) => {
    this.setState({
      SearchListloading: true
    }, () => {
      let params = {
        ...rowinfo,
        status: rowinfo.status ? 1 : 0
      }
      redirectionUrlDelByUrl(params).then((data) => {
        console.log('redirectionUrlDelByUrl', data.res);
        if (data.res.code === 'K-000000') {
          message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }))
        } else {
          message.success(RCi18n({ id: 'PetOwner.Unsuccessful' }))
        }
      }).catch((err) => { }).finally(() => {
        this.init();
        this.setState({
          SearchListloading: false
        })
      })
    })
  }

  render() {
    const { dataSource, SearchListloading } = this.state;
    return (
      <div className='content-redirection'>
        {/* <AuthWrapper functionName="fOrderList001"> */}
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <SearchHead onSearch={this.onSearch} init={this.init} />
          </div>
          <div className="container">
            <SearchList dataSource={dataSource} Onchange={this.statusOnchange} loading={SearchListloading} init={this.init} redirectionDel={this.redirectionDel} />
          </div>
        </div>
        {/* </AuthWrapper> */}
      </div>
    );
  }
}
