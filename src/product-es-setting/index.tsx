
import { BreadCrumb, SelectGroup, Const, Headline, RCi18n } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table,Tag,Modal , Spin, Pagination } from 'antd';
import * as webapi from './webapi';
const confirm = Modal.confirm;
// import { FormattedMessage } from 'react-intl';
const { TextArea } = Input;

  import React, { Component, useState } from 'react';
  import { Breadcrumb } from 'antd';
import Password from 'antd/lib/input/Password';
  
  export default class ProductESSetting extends Component<any, any> {
    constructor(props: any) {
      super(props);
      let lastParams = { current: 1 };
      const { current, ...rest } = lastParams;
      this.state = {
        storeData: [],
        pageBody:{
          pageSize: '1' ,
          pageNum: '5'
        },
        rowSelection:'',
        pagination: {
          current: current,
          pageSize: 10,
          total: 0
        },
        visible: false,
        display:'none',
        selectedRowKeys:[],
        selectedRowList:[],
        passwords:'',
        id: this.props.match.params.id ? this.props.match.params.id : '',
        pageType: this.props.match.params.id ? 'edit' : 'create'
      };
    }

    onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    };

    init = () => {
      let params = {
        pageBody: this.state.pageBody
      };
      // console.log(params)
    webapi
      .getStoreList(params)
      .then((data)=>{
        const res = data.res
        if (res.code === Const.SUCCESS_CODE) {
          // console.log(res.context.storeVOPage.content,'11111')
          this.setState({
            storeData: res.context.storeVOPage.content
          })
        }
      })      
      .catch((err) => {
        console.log(err)
      });

    }

    componentDidMount() {
      this.init()
      console.log(this.state.storeData)
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    };
  
    handleOk = e => {
      console.log(e);
      // this.setState({visible: false});
          let storeDatas= this.state.storeData;
          let passwords = this.state.passwords;
          let selectedRowList = [];
          let params = this.state.selectedRowKeys; 
          console.log(passwords)
          for(let i = 0 ;i<params.length;i++){
              selectedRowList[i] = storeDatas[params[i]].storeId
          }
          if(passwords==='imrc'){
          webapi
          .rebuildStore(selectedRowList)
          .then()
          .catch((err)=>{
            console.log(err)
          })
          }else{
            this.setState({
              display:'inline'
            })
            setTimeout(() => {
              this.setState({
                display:'none'
              })
            }, 5000);
          }
    };
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
        selectedRowKeys:[],
      });

      console.log('cancel')
    };

    rebuildConfirm=(text, record)=>{
      console.log(text,record);
      const passwords = this.state.passwords;
      const display = this.state.display;
      confirm({
        title: 'Tips',
        content:(
          <div>
          <br/><br/>
          <h3>Are you sure to recreate the selected row?</h3>
          <br/>
          <Input.Password 
          style={{width:"200px"}}
          value={passwords} 
          onChange={(e) => {
                              const newValue = (e.target as any).value;
                              console.log(newValue,'newValue')
                              this.setState({
                                passwords:newValue
                              })
                            }}
          placeholder='input password' />
          <div  style={{color:'red',display:display,marginLeft:'10px'}}>  Password error </div>
        </div>
      ),
        okText: 'Save',
        cancelText: 'cancel',
        onOk(){
          if(passwords==='imrc'){
            let thisStoreId = [];
            console.log(record.storeId);
            thisStoreId[0] = record.storeId
            webapi
            .rebuildStore(thisStoreId)
            .then()
            .catch((err)=>{
              console.log(err)
            })
          }else{
            this.setState({
              display:'inline'
            })
            setTimeout(() => {
              this.setState({
                display:'none'
              })
            }, 5000);
          }
        }
    })}

    render() {
      const {storeData,selectedRowKeys,passwords} = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
      const hasSelected = selectedRowKeys.length > 0;
      const columns = [
        {
          title: 'Store id',
          dataIndex: 'storeId',
          key: 'storeId',
        },
        {
          title: 'Store Name',
          dataIndex: 'storeName',
          key: 'storeName',
          // render: (text, record) => (
          //   <TextArea
          //                 defaultValue={text}
          //                 onChange={(e) => {
          //                   const value = (e.target as any).value;
          //                   record.storeName = [...value]
          //                 }}
          //       />
          //   )
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Button 
            onClick={()=>this.rebuildConfirm(text, record)}
            >
              <a>Rebuild</a>
            </Button>

          ),
        },
      ];
     
      return (
      <>
           <div>
             <BreadCrumb />
             <div className="container-search">
               <Button type="primary" style={{ margin: '10px 0 10px 0' }}
                      onClick={this.showModal} disabled={!hasSelected}
               >
                   <span>
                     Rebuild Selected
                     {/*<FormattedMessage id="Product.AddNewTagging" />*/}
                   </span>
               </Button>
               <Modal
                    // title="确定重新创建所选?"
                    maskClosable={false}
                    title={<div>
                      <br/><br/><br/>
                      <h3>Are you sure to recreate the selected row?</h3>
                      <br/>
                      
                      <Input.Password
                      style={{width:"200px"}} 
                      value={passwords} 
                      onChange={(e) => {
                                          const newValue = (e.target as any).value;
                                          this.setState({
                                            passwords:newValue
                                          })
                                        }}
                      placeholder='input password' />
                    <div  style={{color:'red',display:this.state.display,marginLeft:'10px'}}>  Password error </div>
                    </div>
                    }
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                  >
                </Modal>
               

               <Table
                rowSelection={rowSelection}
                 style={{ paddingRight: 20 }}
                 columns={columns}
                 dataSource={storeData}
                 className="device-table"
                //  pagination={this.state.pagination}
                //  onChange={this.onTableChange}
                 scroll={{ x: '100%' }}
               />

                {/* <Pagination key="Pagination" 
                      onChange={(pageNum, pageSize) => 
                            freightTemplateStore(pageNum - 1, pageSize)} 
                            current={number} 
                            total={totalElements} 
                            pageSize={size} 
                            /> */}

             </div>
           </div>

      </>
      );
    }
  }
