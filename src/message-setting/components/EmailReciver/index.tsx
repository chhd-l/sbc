import React from 'react';

export default function index() {
  return (
    <div>
      {this.props.form.getFieldValue('reciverEmails')?.map((item, index) => {
        const isLongTag = item.length > 20;
        const tagElem = (
          <Tag
            key={item}
            closable={index !== 0}
            onClose={() => this.handleClose(item)}
            style={{ marginTop: '8px' }}
          >
            {isLongTag ? `${item.slice(0, 20)}...` : item}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={item} key={item}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
    </div>
  );
}
