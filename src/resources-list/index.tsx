import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline, Const } from 'qmkit';
import SearchForm from './component/search-form'
import ListTable from './component/list'
import BulkPlanningModal from './component/bulk-planning';

const styles = {
  planningBtn: {
      marginRight: 12
  }
};
const ResourcesList = () => {
  const [showBulkPlanningModal,setShowBulkPlanningModal] = useState(false);
  const [selectedRowKeys,setSelectedRowKeys] = useState([])

  const listSelect = (selectedRowKeys) =>{
    console.log(selectedRowKeys,'selectedRowKeysselectedRowKeys')
    setSelectedRowKeys(selectedRowKeys)
  }
  const handlePlanningBtn = () =>{
    if(selectedRowKeys.length) {
      setShowBulkPlanningModal(true)
    }else {
      Modal.info({
        // title: 'Notification',
        content: ((window as any).RCi18n({id:'Resources.bulk_planning_btn_warning'})),
        onOk() {},
      });
    }
  }
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
            onClick={handlePlanningBtn}
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
      <ListTable onSelectChange={(selectedRowKeys)=>listSelect(selectedRowKeys)}/>

          </div>
          <BulkPlanningModal visible={showBulkPlanningModal} onCancel={()=>{setShowBulkPlanningModal(false)}}/>
    </div>
  )
};

export default ResourcesList;
