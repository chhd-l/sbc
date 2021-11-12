import React from 'react';
import { Upload, Icon, message } from 'antd';
import { Const } from 'qmkit';

const FILE_MAX_SIZE = 4 * 1024 * 1024;

export default class FileItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      url: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`
    };
  }

  render() {
    const { value, onChange, disabled } = this.props;
    const { url } = this.state;
    const uploadOption = {
      headers:{
        Accept: 'application/json',
        Authorization: 'Bearer ' + ((window as any).token || ''),
      },
      name: 'uploadFile',
      fileList: value,
      accept:'.jpg,.jpeg,.png,.pdf',
      action: url,
      disabled: disabled,
      onChange: (info) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
          if (file.response && file.response.code && file.response.code !== Const.SUCCESS_CODE) {
            message.error(`${file.name} upload failed`);
          } else if (file.response && file.response[0]) {
            file.url = file.response[0];
          }
          return file;
        }).filter(file => file.status !== 'error');
        onChange(fileList);
      },
      beforeUpload: (file)=>{
        let fileName = file.name.toLowerCase();
        // 支持的图片格式：jpg、jpeg、png、pdf
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.pdf')) {
          if (fileName.endsWith('.pdf')) {
            this.setState({
              url: `${Const.HOST}/store/uploadStoreResource?resourceType=PDF`
            });
          } else {
            this.setState({
              url: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`
            });
          }
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error('file size cannot exceed 2M');
            return false;
          }
        } else {
          message.error('file format error');
          return false;
        }
      }
    };

    return (
      <Upload {...uploadOption}>
        <div style={{padding: '20px 25px', backgroundColor: '#f4f4f4', border: '1px solid #eeeeee'}}>
          <Icon style={{fontSize: 20}} type="plus" />
        </div>
      </Upload>
    );
  }
}
