import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import * as webapi from './webapi';
import { Const } from 'qmkit';
import { getPreviewEmailTemp } from '../../web_modules/qmkit/previewEmail';


const MessageTemplateDetail = ({ visibleTemplate, setVisibleTemplate, taskId }) => {

  const [loading, setLoading] = useState(true);
  const [previewHtml, setPreviewHtml] = useState('');
  const [templateTaskId, setTemplateTaskId] = useState('');


  const params = {
    taskId: taskId
  };

  const getEmailTask = () => {
    setLoading(true);
    webapi
      .viewEmailTask(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          setLoading(false);

          const templateDate = res.context;
          const emailTemp = templateDate?.messageTemplateContent;
          const emailData = JSON.parse(templateDate.messageSendParams)?.templateData;

          const template = getPreviewEmailTemp(emailTemp, emailData);
          setTemplateTaskId(templateDate.messageTaskId);
          setPreviewHtml(template);
        }
      });
  };

  useEffect(() => {
    if (visibleTemplate) {
      getEmailTask();
    }
  }, [visibleTemplate]);


  return (
    <>
      <Modal
        width='800px'
        title={templateTaskId}
        onCancel={() => setVisibleTemplate()}
        visible={visibleTemplate}
        footer={[
          <Button key='back' shape='round' onClick={() => setVisibleTemplate()}>
            Cancel
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          {previewHtml ? <div dangerouslySetInnerHTML={{ __html: previewHtml }} style={{ zoom: '0.5' }}></div> : null}
        </Spin>
      </Modal>
    </>
  );
};

export default MessageTemplateDetail;