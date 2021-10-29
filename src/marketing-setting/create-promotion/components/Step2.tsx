import React,{useContext} from 'react'
import { Form, Input, DatePicker, Button } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { Const, QMMethod } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { FormContext } from '../index';

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function Step2({setStep,form}) {
  const Context:any = useContext(FormContext);
  const { formData } = Context
  const {getFieldDecorator,validateFields,} = form

  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.BasicSetting" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        <Form.Item label={<FormattedMessage id="Marketing.PromotionName" />}>
          {getFieldDecorator('marketingName', {
            initialValue: formData?.BasicSetting?.marketingName,
            rules: [
              {
                required: true,
                whitespace: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseInputPromotionName'
                  })
              },
              {
                min: 1, max: 40, message:
                  (window as any).RCi18n({
                    id: 'Marketing.40Words'
                  })
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback,
                    (window as any).RCi18n({
                      id: 'Marketing.PromotionName'
                    })
                  );
                }
              }
            ],
          })(
            <Input size="large" placeholder={(window as any).RCi18n({ id: 'Marketing.noMoreThan40Words' })}/>,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="Marketing.StartAndEndTime" />}>
          {getFieldDecorator('time', {
            initialValue: formData?.BasicSetting?.time,
            rules: [
              {
                required: true,
                message: (window as any).RCi18n({
                  id: 'Marketing.PleaseSelectStartingAndEndTime'
                })
              }
            ],
          })(
            <RangePicker size="large"
                         showTime={{ format: 'HH:mm' }}
                         format={Const.DATE_FORMAT}
                         placeholder={[
                           (window as any).RCi18n({
                             id: 'Marketing.StartTime'
                           }), (window as any).RCi18n({
                             id: 'Marketing.EndTime'
                           })
                         ]}
            />,
          )}
        </Form.Item>
      </Form>

      <ButtonLayer setStep={setStep} step={1} validateFields={validateFields}/>
    </div>
  );
}
export default Form.create<any>()(Step2);