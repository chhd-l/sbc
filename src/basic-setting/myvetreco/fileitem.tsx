import React from 'react';
import { Upload, Icon, message } from 'antd';
import { Const } from 'qmkit';

const FILE_MAX_SIZE = 4 * 1024 * 1024;

export default class FileItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, onChange } = this.props;
    const uploadOption = {
      headers:{
        Accept: 'application/json',
        Authorization: 'Bearer ' + ((window as any).token || ''),
      },
      name: 'uploadFile',
      fileList: value && value.length ? value.map(item => ({ uid: -1, name: item, url: item, status: 'done' })) : [],
      accept:'.jpg,.jpeg,.png,.pdf',
      action: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`,
      onChange: (info) => {
        const { file } = info;
        if(file.status !== 'removed'){
          onChange([file.name]);
        }
        if (file.status === 'done') {
          if(
              file.status == 'done' &&
              file.response &&
              file.response.code &&
              file.response.code !== Const.SUCCESS_CODE
          ){
            message.error(info.file.response.message);
            onChange([]);
          }else{
            onChange(file.response.length > 0 && file.response[0] ? [file.response[0]] : []);
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} file upload failed.`);
          onChange([]);
        }
      },
      beforeUpload: (file)=>{
        let fileName = file.name.toLowerCase();
        // 支持的图片格式：jpg、jpeg、png、pdf
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.pdf')) {
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
      },
      onRemove: (promise)=>{
        onChange([]);
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
