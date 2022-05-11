import { Input, Tag, Tooltip, Form, Button } from 'antd';
import React, { cloneElement, KeyboardEventHandler, useState } from 'react';
import { FormattedMessage } from 'react-intl';
type TagValue = string[];
type EmailReciverProps = { value?: TagValue; onChange?: (value: TagValue) => void };
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
const EmailReciver = ({ onChange, value }: EmailReciverProps) => {
  const [isError, setError] = useState(false);
  // 按enter时判断是否通过校验 不通过显示错误 通过移除错误并通知form
  const onPressEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.currentTarget.value;
    if (!emailReg.test(inputValue)) {
      return setError(true);
    }
    setError(false);
    onChange([...(value ?? []), inputValue]);
  };
  const onTagClose = (removedTag: string) => {
    const filterTag = value.filter((tag) => tag !== removedTag);
    onChange(filterTag);
  };
  const tagList = (
    <div>
      {value?.map((item, index) => {
        let tagInner = item;
        let tagWapper = <></>;
        if (item.length > 20) {
          tagInner = `${item.slice(0, 20)}...`;
          tagWapper = <Tooltip title={item} key={item} />;
        }
        return cloneElement(tagWapper, {
          children: (
            <Tag
              key={item}
              closable={index !== 0}
              onClose={() => onTagClose(item)}
              style={{ marginTop: '8px' }}
            >
              {tagInner}
            </Tag>
          )
        });
      })}
    </div>
  );
  return (
    <>
      {tagList}
      <Input type="text" onPressEnter={onPressEnter} />
      {isError && (
        <Form.Item
          validateStatus="error"
          help={<FormattedMessage id="Order.offline.consumerEmailRequired" />}
        />
      )}
    </>
  );
};
export default EmailReciver;
