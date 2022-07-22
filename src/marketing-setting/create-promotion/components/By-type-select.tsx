// 1.	补充以下组件缺少的类型  3分
import React, { useState, useEffect } from "react";
import { Select, Checkbox } from "antd";
import { RCi18n } from "qmkit";

const { Option } = Select;

type ByTypeSelectPropsType = {
  onChange?: (any) => void;
  value?: any[];
}

const ByTypeSelect = ({ onChange, value }: ByTypeSelectPropsType) => {
  const [checkedarr, setChecked] = useState([]);
  const [disabledValue, setDisabledValue] = useState([])

  const [customerTypeArr] = useState([
    {
      value: 'Normal Member',
      name: RCi18n({ id: 'PetOwner.NormalMember' }),
      id: 234
    },
    {
      value: 'Club Member',
      name: RCi18n({ id: 'PetOwner.ClubMember' }),
      id: 235
    },
    {
      value: 'Guest',
      name: RCi18n({ id: 'PetOwner.Guest' }),
      id: 233
    }
  ]);

  useEffect(() => {
    setChecked(value || [])
    console.log(11111111111111);
  }, []);

  useEffect(() => {
    if (checkedarr.length < 2) {
      setDisabledValue(customerTypeArr.map((item) => item.id))
    } else {
      setDisabledValue(checkedarr)
    }

  }, [checkedarr.length]);


  function handleChange(val) {
    console.log(`selected ${val}`);
    console.log('checked', checkedarr)
    if (val.length <= 2) {
      setDisabledValue(customerTypeArr.map((item) => item.id));
      setChecked(val);
      // 自定义表单核心，回传数据
      onChange([
        ...val,
      ])
    } else {
      setDisabledValue(checkedarr);
    }
  }


  return (
    <Select
      mode="multiple"
      showArrow
      style={{ width: 350 }}
      placeholder={(window as any).RCi18n({ id: 'Marketing.PleaseSelect' })}
      onChange={handleChange}
      // onSelect={handleSelect}
      // onDeselect={handleDeselect}
      // value={checkedarr}
      optionLabelProp="label"
      getPopupContainer={triggerNode => triggerNode.parentElement}
    >
      {customerTypeArr.map((item) => {
        return (<Option
          key={item.id}
          value={item.id}
          disabled={!disabledValue.includes(item.id)}
          label={item.name}
        >
          <div>
            <Checkbox
              checked={checkedarr.includes(item.id)}
              disabled={!disabledValue.includes(item.id)}
            ></Checkbox>
            <span style={{ marginLeft: '8px' }}>{item.name}</span>
          </div>
        </Option>)
      })}
    </Select>

  )
}

export default ByTypeSelect;
