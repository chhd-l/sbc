import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BreadCrumb, Headline } from 'qmkit';
import * as webapi from './webapi';
import SearchForm from './component/search-form'
import ListTable from './component/list'
import BulkPlanningModal from './component/bulk-planning';

const styles = {
  planningBtn: {
    marginRight: 12
  }
};
const ResourcesList = () => {

  const [showBulkPlanningModal, setShowBulkPlanningModal] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([])
  const [serviceTypeDict,setServiceTypeDict] = useState([])
  const [appointmentTypeDict,setAppointmentTypeDict] = useState([])
  const [resourceList,setResourceList] = useState([])

  useEffect(()=>{
    getResourcesPageLists({})
    getTypeDict()
  },[])

  const getTypeDict = async () => {
    const serviceTypeRes = await webapi.goodsDict({ type: 'service_type' })
    const appointmentTypeRes = await webapi.goodsDict({ type: 'apprintment_type' })
    const serviceTypeDict = serviceTypeRes?.res?.context?.goodsDictionaryVOS || []
    const appointmentTypeDict = appointmentTypeRes?.res?.context?.goodsDictionaryVOS || []
    setServiceTypeDict(serviceTypeDict)
    setAppointmentTypeDict(appointmentTypeDict)
  }

  const getResourcesPageLists = async (params) => {
    const {res} = await webapi.getResourcesList(params);
    setResourceList(res?.context?.resourceVOList)
  }

  // 列表复选框选择
  const listSelect = (selectedRowKeys,selectedRows) => {
    let employeeIds = []
    selectedRows.map(item => employeeIds.push(item.employeeId))
    setSelectedEmployeeIds(employeeIds)
  }

  // 点击bulk planning按钮,进行批量设置
  const handlePlanningBtn = () => {
    if (selectedEmployeeIds.length) {
      setShowBulkPlanningModal(true)
    } else {
      Modal.info({
        content: ((window as any).RCi18n({ id: 'Resources.bulk_planning_btn_warning' })),
        onOk() { },
      });
    }
  }

  // 搜索查询
  const handleSearch = (data) => {
    getResourcesPageLists(data)
    console.log(data, 'data=====')
    // todo:表格list接口请求
  }

  // 翻页处理
  // const changePageNum = (pageNum) => {
  //   console.log(pageNum, '99999')
  //   // todo:翻页时，更新表格list接口请求
  // }
  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title={<FormattedMessage id="Resources.list" />} />
        <SearchForm onSearch={handleSearch} serviceTypeDict={serviceTypeDict} appointmentTypeDict={appointmentTypeDict}/>
        <Row>
          <Col span={6} offset={18}>
            <Button
              type="primary"
              style={styles.planningBtn}
              onClick={handlePlanningBtn}
            >
              <span>
                <FormattedMessage id="Resources.bulk_planning" />
              </span>
            </Button>
            <Button
              type="primary"
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
        <ListTable
        resourceList={resourceList}
          onSelectChange={(selectedRowKeys,selectedRows) => listSelect(selectedRowKeys,selectedRows)}
          // updateListData={changePageNum}
        />
      </div>
      <BulkPlanningModal
        visible={showBulkPlanningModal}
        selectedEmployeeIds={selectedEmployeeIds}
        serviceTypeDict={serviceTypeDict}
        onCancel={() => { setShowBulkPlanningModal(false) }} />
    </div>
  )
};

export default ResourcesList;
