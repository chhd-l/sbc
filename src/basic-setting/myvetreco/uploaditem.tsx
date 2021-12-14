import React from 'react';
import { Row, Col, Radio } from 'antd';
import { SupportedDocumentUtil } from './main';
import FileItem from './fileitem';

type FileItemProp = {
  filePath: string;
  documentType: 'PASSPORT' | 'ID_CARD_FRONT' | 'ID_CARD_BACK' | 'DRIVING_LICENCE_FRONT' | 'DRIVING_LICENCE_BACK';
};

interface UploadItemProp {
  value: FileItemProp[];
  onChange: (value: FileItemProp[]) => any;
  disabled?: boolean;
}

export default class UploadItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  handleFileTypeChange = (e) => {
    const fileType = e.target.value;
    const { value, onChange } = this.props;
    onChange({
      ...value,
      documentType: fileType
    });
  };

  handleFileUpload = (documentType, fileList) => {
    const { value, onChange } = this.props;
    onChange({
      ...value,
      [documentType]: fileList
    });
  };

  getFileListByDocumentType = (documentType) => {
    const { value } = this.props;
    const targetDocumentObj = value.find(fi => fi.documentType === documentType);
    if (!targetDocumentObj || !targetDocumentObj.filePath) {
      return [];
    } else {
      return [targetDocumentObj];
    }
  };

  render() {
    const { value, disabled } = this.props;
    
    return (
      <div>
        <Radio.Group value={value.documentType} onChange={this.handleFileTypeChange} disabled={disabled}>
          <Radio value="PASSPORT">Passport</Radio>
          <Radio value="ID_CARD">ID</Radio>
          <Radio value="DRIVING_LICENCE">Driving License</Radio>
        </Radio.Group>
        <Row gutter={24}>
          {value.documentType === 'PASSPORT' ? <Col span={24}>
            <FileItem
              value={value['PASSPORT'] ?? []}
              onChange={(fileList) => this.handleFileUpload('PASSPORT', fileList)}
              disabled={disabled}
            />
          </Col> : <>
            <Col span={12}>
              <FileItem
                value={value[`${value.documentType}_FRONT`] ?? []}
                onChange={(fileList) => this.handleFileUpload(`${value.documentType}_FRONT`, fileList)}
                disabled={disabled}
              />
            </Col>
            <Col span={12}>
              <FileItem
                value={value[`${value.documentType}_BACK`] ?? []}
                onChange={(fileList) => this.handleFileUpload(`${value.documentType}_BACK`, fileList)}
                disabled={disabled}
              />
            </Col>
          </>}
        </Row>
        {value.documentType !== 'PASSPORT' && <Row gutter={24}>
          <Col span={12}><div style={{width:72,textAlign:'center'}}>Front</div></Col>
          <Col span={12}><div style={{width:72,textAlign:'center'}}>Back</div></Col>
        </Row>}
      </div>
    );
  }
}
