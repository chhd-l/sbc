import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Select, Input, Button, Divider, message, Tooltip, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import { Headline, BreadCrumb, SelectGroup, Const, RCi18n } from 'qmkit';
import * as webapi from './webapi';
import TablePage from './component/table';


const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      dictionaryTypes: []
    };
  }

  componentDidMount() {
    this.getDictionaryTypes();
  }

  getDictionaryTypes = async () => {
    const { res } = await webapi.getDictionaryTypes();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        dictionaryTypes: res.context
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dictionaryTypes } = this.state;

    return (
      <Form className='filter-content' layout='inline' onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('keywords')(
            <Input
              addonBefore={<FormattedMessage id='Setting.Keyword' />}
              placeholder={(window as any).RCi18n({ id: 'Setting.Pleaseinputnameordiscription' })}
              style={{ width: 300 }}
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('type', {
            initialValue: ''
          })(
            <SelectGroup
              label={<FormattedMessage id='Setting.Type' />}
              showSearch
              style={{ width: 300 }}
            >
              <Option value=''>{(window as any).RCi18n({ id: 'Setting.All' })}</Option>
              {dictionaryTypes.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </SelectGroup>
          )}
        </FormItem>

        <FormItem>
          <Button
            type='primary'
            htmlType='submit'
            icon='search'
            shape='round'
          >
            <FormattedMessage id='Setting.search' />
          </Button>
        </FormItem>
      </Form>
    );
  }
}


interface SearchFormProps extends FormComponentProps {
  onSearch: (params) => void
}

const WrappedSearchForm = Form.create<SearchFormProps>()(SearchForm);


class ProductDictionary extends Component<any, any> {
  tableRef: any;

  constructor(props) {
    super(props);

    this.tableRef = React.createRef();

    this.state = {
      columns: [
        {
          title: <FormattedMessage id='Setting.Name' />,
          dataIndex: 'name',
          key: 'name',
          width: '20%'
        },
        {
          title: <FormattedMessage id='Setting.Type' />,
          dataIndex: 'type',
          key: 'type',
          width: '20%'
        },
        {
          title: <FormattedMessage id='Setting.Value' />,
          dataIndex: 'valueEn',
          key: 'value',
          width: '20%'
        },
        {
          title: <FormattedMessage id='Setting.Description' />,
          dataIndex: 'description',
          key: 'description',
          width: '20%'
        },
        {
          title: <FormattedMessage id='Setting.Priority' />,
          dataIndex: 'priority',
          key: 'priority',
          width: '10%'
        },
        {
          title: <FormattedMessage id='Setting.Priority' />,
          dataIndex: 'operation',
          key: 'operation',
          width: '10%',
          render: (text, record) => (
            <span>
              <Tooltip placement='top' title={`${RCi18n({ id: 'Setting.Edit' })}`}>
                <Link to={'/product-dictionary-edit/' + record.id} className='iconfont iconEdit' />
              </Tooltip>

              <Divider type='vertical' />
              <Popconfirm placement='topLeft' title={`${RCi18n({ id: 'Setting.Areyousuretodelete' })}`}
                          onConfirm={() => this.handleDelete(record.id)}
                          okText={(window as any).RCi18n({ id: 'Setting.Confirm' })}
                          cancelText={(window as any).RCi18n({ id: 'Setting.Cancel' })}>
                <Tooltip placement='top' title={`${RCi18n({ id: 'Setting.Delete' })}`}>
                  <a type='link' className='iconfont iconDelete' />
                </Tooltip>
              </Popconfirm>
            </span>
          )
        }
      ]
    };
  }

  searchFunc = async (params) => {
    const { res } = await webapi.fetchDictionaryList(params);

    if (res.code === Const.SUCCESS_CODE) {
      return res.context.sysDictionaryPage;
    } else {
      return false;
    }
  };

  handleSearch = (params) => {
    this.tableRef.current?.resetSearch(params);
  };

  handleRefresh = () => {
    this.tableRef.current?.search();
  };

  handleDelete = async (id) => {
    const { res } = await webapi.deleteDictionary({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.handleRefresh();
    }
  };

  render() {
    return (
      <div>
        <BreadCrumb />

        <div className='container-search'>
          <Headline title={`${RCi18n({ id: 'Setting.Dictionary' })}`} />

          <WrappedSearchForm onSearch={this.handleSearch} />

          <Button type='primary' htmlType='submit' style={{ marginBottom: '10px' }}>
            <Link to='/product-dictionary-add'><FormattedMessage id='Setting.Add' /></Link>
          </Button>
        </div>

        <div className='container'>
          <TablePage
            ref={this.tableRef}
            initLoad={true}
            searchFunc={this.searchFunc}
            columns={this.state.columns}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(ProductDictionary);