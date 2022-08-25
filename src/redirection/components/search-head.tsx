import React, { Component, useState, useEffect } from 'react';
import { IMap, Relax } from 'plume2';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Menu,
  Dropdown,
  Icon,
  DatePicker,
  Row,
  Col,
  Modal,
  message
} from 'antd';
import {
  noop,
  ExportModal,
  Const,
  AuthWrapper,
  checkAuth,
  Headline,
  ShippStatus,
  PaymentStatus,
  RCi18n
} from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import './search-head.less';
import AddNewRedirectionModal from './AddNewRedirectionModal';

const FormItem = Form.Item;

type SearchHeadtype = {
  onSearch: Function;
  init: Function;
}
const SearchHead = ({ onSearch, init }: SearchHeadtype) => {

  const [url, SetUrl] = useState('');
  const [modalVisable, setModalVisable] = useState(false);

  let hasMenu = false;
  if (
    (checkAuth('fOrderList002')) || checkAuth('fOrderList004')) {
    hasMenu = true;
  }

  const menu = (
    <Menu>
      <Menu.Item>
        {/* <AuthWrapper functionName="fOrderList004"> */}
        <Link to="/redirection-import">
          <FormattedMessage id="Content.batchUpload" />
        </Link>
        {/* </AuthWrapper> */}
      </Menu.Item>
      <Menu.Item>
        <AuthWrapper functionName="fOrderList004">
          {/* <Link to="/redirection-import"> */}
          <FormattedMessage id="Order.batchExport" />
          {/* </Link> */}
        </AuthWrapper>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className=''>
      <Row>
        <Col span={12}>
          <Headline title={<FormattedMessage id="Menu.Redirection Management" />} />
        </Col>
      </Row>
      <div>
        <Form className="filter-content" layout="inline">
          <Row>
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    allowClear
                    addonBefore={<FormattedMessage id="Content.URL" />}
                    style={styles.wrapper}
                    onChange={(e) => {
                      SetUrl((e.target as any).value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center' }}
                    onClick={(e) => {
                      onSearch({ url });
                    }}
                  >
                    <span>
                      <FormattedMessage id="Order.search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>

          </Row>
        </Form>

        <Row style={{ padding: '4px 16px 4px' }}>
          <Col span={8}>
            <Button
              type="primary"
              style={{ textAlign: 'center' }}
              onClick={() => setModalVisable(true)}
            >
              <FormattedMessage id="Content.AddNewRedirection" />
            </Button>
          </Col>
          <Col span={8} offset={8}>
            {hasMenu && (
              <div
                className="handle-bar ant-form-inline filter-content"
                style={{ textAlign: 'right' }}
              >
                <Dropdown
                  overlay={menu}
                  placement="bottomLeft"
                  getPopupContainer={(trigger: any) => trigger.parentNode}
                >
                  <Button>
                    <FormattedMessage id="Content.BatchOperations" /> <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <AddNewRedirectionModal
        // RedirectionData={{
        //   url: '胡彦祖',
        //   redirection: 42,
        //   redirectionType: '西湖区湖底公园1号',
        //   status: false
        // } || null}
        onCancel={() => setModalVisable(false)}
        visable={modalVisable}
        init={init}
      />
    </div>
  );
}

export default SearchHead;

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'default',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  wrapper: {
    width: 200
  }
} as any;
