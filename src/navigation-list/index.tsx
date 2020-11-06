import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, DragTable } from 'qmkit';
import { Col, Row, Button, message, Select } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const Option = Select.Option;

export default class NavigationList extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: 'Navigation list',
      languages: [],
      selectLanguage: '',
      dataSource: [{}]
    };
    this.getLanguages = this.getLanguages.bind(this);
  }

  componentDidMount() {
    this.getLanguages('Language');
  }

  getLanguages(type: String) {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let languages = [...res.context.sysDictionaryVOS];
          this.setState({
            languages
          });
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  }
  render() {
    const { title, languages, dataSource } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
      },
      {
        title: 'Navigation Item',
        dataIndex: 'navigationName',
        key: 'navigationName',
        width: '10%'
      }
    ];
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
          <Row style={{ marginTop: '30px' }}>
            <Col span={12}>
              <Button type="primary" htmlType="submit">
                <Link to="/dictionary-add">Add New Navigation Item</Link>
              </Button>
            </Col>
            <Col span={12}>
              <Select
                defaultValue=""
                style={{ width: 200 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.setState({
                    selectLanguage: value
                  });
                }}
              >
                <Option value="" style={{ paddingLeft: '35px' }}>
                  <FormattedMessage id="all" />
                </Option>
                {languages &&
                  languages.map((item, index) => (
                    <Option value={item.valueEn} key={index}>
                      <img style={{ height: '20px', width: '20px' }} src={item.description} alt="Image" /> {item.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <Row>
            <DragTable columns={columns} dataSource={dataSource} />
          </Row>
        </div>
      </div>
    );
  }
}
