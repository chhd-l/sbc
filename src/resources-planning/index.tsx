import React, { useEffect, useState } from 'react';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
// import * as webapi from './webapi'
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, Const } from 'qmkit';
import SearchForm from './component/search-form'
import ListTable from './component/list'

const styles = {
  planningBtn: {
      marginRight: 12
  }
};
const ResourcesList = () => {

  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.list" />} />
        <SearchForm />
        <Row>
          <Col span={6} offset={18}>
            <Button
              type="primary"
              style={styles.planningBtn}
              // htmlType="submit"
              // icon="search"
            // onClick={(e) => {
            //   e.preventDefault();
            //   onSearch();
            // }}
            >
              <span>
                <FormattedMessage id="Resources.bulk_planning" />
              </span>
            </Button>
            <Button
              type="primary"
              // htmlType="submit"
              // icon="search"
              // shape="round"
            // onClick={(e) => {
            //   e.preventDefault();
            //   onSearch();
            // }}
            >
              <span>
                <FormattedMessage id="Resources.calendar_view" />
              </span>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="container">
      <ListTable/>

          </div>
    </div>
  )
};

export default ResourcesList;
