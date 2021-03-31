import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Tabs, Popconfirm } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class AttributeLibrary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.ProductTagging" />,
      searchForm: {
        taggingName: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      taggingList: [],

      visible: false,
      taggingForm: {
        taggingName: '',
        taggingFontColor: '',
        taggingFillColor: '',
        taggingType: 'Text',
        taggingImgUrl: '',
        displayStatus: false,
        showPage: []
      },
      isEdit: false,
      currentEditTagging: {},
      modalName: '',
      colourList: [],
      shopPageList: [],
      loading: true,
      images: []
    };
  }
  componentDidMount() {
    this.querySysDictionary('colour');
    this.querySysDictionary('shopPage');
    this.getTagging();
  }

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    this.getTagging();
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getTagging()
    );
  };
  setImageUrl = (url) => {
    const { form } = this.props;
    this.onTaggingFormChange({ field: 'taggingImgUrl', value: url });
    form.setFieldsValue({
      taggingImgUrl: url
    });
  };
  onTaggingFormChange = ({ field, value }) => {
    let data = this.state.taggingForm;
    data[field] = value;
    this.setState({
      taggingForm: data
    });
  };

  openAddPage = () => {
    let taggingForm = {
      taggingName: '',
      taggingFontColor: '',
      taggingFillColor: '',
      taggingType: 'Text',
      taggingImgUrl: '',
      displayStatus: false,
      showPage: []
    };
    this.setState({
      modalName: 'Add new tagging',
      visible: true,
      taggingForm,
      isEdit: false,
      loading: false
    });
  };
  openEditPage = (row) => {
    const { form } = this.props;
    row.taggingType = row.taggingType ? row.taggingType : 'Text';
    let taggingForm = {
      taggingName: row.taggingName,
      taggingType: row.taggingType,
      taggingFontColor: row.taggingFontColor,
      taggingFillColor: row.taggingFillColor,
      taggingImgUrl: row.taggingImgUrl,
      displayStatus: row.displayStatus,
      showPage: row.showPage ? row.showPage.split(',') : []
    };
    let images = [];
    if (row.taggingImgUrl) {
      images.push(row.taggingImgUrl);
    }
    this.setState(
      {
        modalName: 'Edit tagging',
        visible: true,
        taggingForm,
        isEdit: true,
        currentEditTagging: row,
        loading: false,
        images: images
      },

      () => {
        this.setImageUrl(row.taggingImgUrl);
      }
    );
  };
  handleSubmit = () => {
    const { taggingForm, isEdit, currentEditTagging } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        taggingForm.taggingType = taggingForm.taggingType ? taggingForm.taggingType : 'Text';
        let params = {
          taggingName: taggingForm.taggingName,
          taggingFontColor: taggingForm.taggingType === 'Text' ? taggingForm.taggingFontColor : '',
          taggingFillColor: taggingForm.taggingType === 'Text' ? taggingForm.taggingFillColor : '',
          taggingType: taggingForm.taggingType,
          taggingImgUrl: taggingForm.taggingType === 'Text' ? '' : taggingForm.taggingImgUrl,
          displayStatus: taggingForm.displayStatus,
          showPage: Array.isArray(taggingForm.showPage) ? taggingForm.showPage.join(',') : taggingForm.showPage
        };
        if (isEdit) {
          params = Object.assign(params, {
            id: currentEditTagging.id
          });
          this.updateTagging(params);
        } else {
          this.addTagging(params);
        }
      }
    });
  };
  getTagging = () => {
    const { searchForm, pagination } = this.state;
    this.setState({
      loading: true
    });
    let params = {
      taggingName: searchForm.taggingName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const taggingList = res.context.taggingList;
          this.setState({ taggingList, pagination, loading: false });
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
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'colour') {
            this.setState({
              colourList: res.context.sysDictionaryVOS,
              loading: false
            });
          }
          if (type === 'shopPage') {
            this.setState({
              shopPageList: res.context.sysDictionaryVOS,
              loading: false
            });
          }
        } else {
        }
      })
      .catch((err) => {});
  };
  addTagging = (params: object) => {
    this.setState({
      loading: true
    });
    webapi
      .addTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
          this.setState(
            {
              visible: false,
              loading: false
            },
            () => this.getTagging()
          );
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
  deleteTagging = (id) => {
    let idList = [];
    idList.push(id);
    let params = {
      idList: idList
    };
    this.setState({
      loading: true
    });
    webapi
      .deleteTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getTagging();
          message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
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

  updateTagging = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visible: false,
            loading: false
          });
          this.getTagging();
          message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
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
  updateTaggingStatus = (checked, row) => {
    let params = {
      taggingFillColor: row.taggingFillColor,
      taggingFontColor: row.taggingFontColor,
      taggingName: row.taggingName,
      taggingType: row.taggingType,
      taggingImgUrl: row.taggingImgUrl,
      displayStatus: checked ? true : false,
      id: row.id
    };
    this.updateTagging(params);
  };

  getColour = (value) => {
    const { colourList } = this.state;
    let colour = colourList.find((item) => item.id == value || item.valueEn === value);
    return colour;
  };

  updateImg = (images) => {
    if (images && images.length > 0) {
      this.setImageUrl(images[0]);
    } else {
      this.setImageUrl('');
    }
    this.setState({
      images
    });
  };
  deleteImg = (item) => {
    const { images } = this.state;
    let tempImages = images.filter((el) => el !== item);
    this.setState({
      images: tempImages
    });
    this.setImageUrl('');
  };

  render() {
    const { loading, title, taggingList, visible, modalName, colourList, taggingForm, shopPageList, images } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: <FormattedMessage id="Product.TaggingName" />,
        dataIndex: 'taggingName',
        key: 'taggingName'
      },
      {
        title: <FormattedMessage id="Product.TaggingType" />,
        dataIndex: 'taggingType',
        key: 'taggingType',
        render: (text) => <div>{text === 'Text' ? 'Text tag (Top left)' : 'Image tag (Top right)'}</div>
      },
      {
        title: <FormattedMessage id="Product.ProductCount" />,
        dataIndex: 'productNum',
        key: 'productNum'
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />}>
              <a style={styles.edit} onClick={() => this.openEditPage(record)} className="iconfont iconEdit"></a>
            </Tooltip>
            <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.sureDeleteThisItem" />} onConfirm={() => this.deleteTagging(record.id)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore="Tagging name"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onSearchFormChange({
                          field: 'taggingName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <span>
                      <FormattedMessage id="Product.search" />
                    </span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="container-search">
            <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
              <span>
                <FormattedMessage id="Product.AddNewTagging" />
              </span>
            </Button>
            <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={taggingList} pagination={this.state.pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
          </div>

          {visible ? (
            <Modal
              zIndex={1000}
              width="600px"
              title={modalName}
              visible={visible}
              confirmLoading={loading}
              maskClosable={false}
              onCancel={() =>
                this.setState({
                  visible: false
                })
              }
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    this.setState({
                      visible: false
                    });
                  }}
                >
                  <FormattedMessage id="Product.Close" />
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
                  <FormattedMessage id="Product.Submit" />
                </Button>
              ]}
            >
              <Form {...formItemLayout}>
                <FormItem label="Tagging name">
                  {getFieldDecorator('taggingName', {
                    rules: [
                      { required: true, message: <FormattedMessage id="Product.TaggingNameIsRequired" /> },
                      {
                        max: 50,
                        message: <FormattedMessage id="Product.ExceedMaximumLength" />
                      }
                    ],
                    initialValue: taggingForm.taggingName
                  })(
                    <Input
                      style={{ width: '80%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="Tagging type">
                  {getFieldDecorator('taggingType', {
                    initialValue: taggingForm.taggingType,
                    rules: [{ required: true, message: <FormattedMessage id="Product.PleaseSelectedTaggingType" /> }]
                  })(
                    <Radio.Group
                      name="radiogroup"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingType',
                          value
                        });
                      }}
                    >
                      <Radio value="Text">
                        <FormattedMessage id="Product.TextTopLeft" />
                      </Radio>
                      <Radio value="Image">
                        <FormattedMessage id="Product.ImageTopRight" />
                      </Radio>
                    </Radio.Group>
                  )}
                </FormItem>

                {taggingForm.taggingType === 'Text' ? (
                  <div>
                    <FormItem label="Tagging font color">
                      {getFieldDecorator('taggingFontColor', {
                        rules: [{ required: true, message: <FormattedMessage id="Product.TaggingFontColor" /> }],
                        initialValue: this.getColour(taggingForm.taggingFontColor) ? this.getColour(taggingForm.taggingFontColor).name : ''
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onTaggingFormChange({
                              field: 'taggingFontColor',
                              value
                            });
                          }}
                        >
                          {colourList.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="Tagging fill color">
                      {getFieldDecorator('taggingFillColor', {
                        rules: [{ required: true, message: <FormattedMessage id="Product.TaggingFillColor" /> }],
                        initialValue: this.getColour(taggingForm.taggingFillColor) ? this.getColour(taggingForm.taggingFillColor).name : ''
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onTaggingFormChange({
                              field: 'taggingFillColor',
                              value
                            });
                          }}
                        >
                          {colourList.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                ) : (
                  <FormItem label="Tagging Image">
                    {getFieldDecorator('taggingImgUrl', {
                      rules: [{ required: true, message: <FormattedMessage id="Product.TaggingImage" /> }]
                    })(<AssetManagement choosedImgCount={1} images={images} selectImgFunction={this.updateImg} deleteImgFunction={this.deleteImg} />)}
                  </FormItem>
                )}
                <FormItem label="Display in shop">
                  {getFieldDecorator('displayStatus', {
                    initialValue: taggingForm.displayStatus ? true : false
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'displayStatus',
                          value
                        });
                      }}
                    >
                      <Radio value={true}>
                        <FormattedMessage id="Product.Yes" />
                      </Radio>
                      <Radio value={false}>
                        <FormattedMessage id="Product.No" />
                      </Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {taggingForm.displayStatus ? (
                  <FormItem label="Shop page">
                    {getFieldDecorator('showPage', {
                      rules: [{ required: true, message: <FormattedMessage id="Product.PleaseSelecShopPage" /> }],
                      initialValue: taggingForm.showPage
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '80%' }}
                        onChange={(value) => {
                          value = Array.isArray(value) ? value.join(',') : value;
                          this.onTaggingFormChange({
                            field: 'showPage',
                            value
                          });
                        }}
                      >
                        {shopPageList.map((item) => (
                          <Option value={item.value} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                ) : null}
              </Form>
            </Modal>
          ) : null}
        </Spin>
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
  }
} as any;

export default Form.create()(AttributeLibrary);
