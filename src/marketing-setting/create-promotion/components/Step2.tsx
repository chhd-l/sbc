import React, { useContext } from 'react'
import { Form, Input, DatePicker, Button } from 'antd';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { Const, QMMethod } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { FormContext } from '../index';
import { enumConst } from '@/marketing-setting/create-promotion/enum';
import TextArea from 'antd/lib/input/TextArea';

const { RangePicker } = DatePicker;

function Step2({ form }) {
  console.log('重绘了')
  const Context: any = useContext(FormContext);
  const { formData, changeFormData, setStep, formItemLayout } = Context
  const { getFieldDecorator, validateFields, } = form
  const toNext = () => {
    validateFields((err, values) => {
      if (!err) {
        changeFormData(enumConst.stepEnum[1], values)
        setStep(2)
      }
    });
  }
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.BasicSetting" />
      </div>

      <Form {...formItemLayout} labelAlign="left" className="marketing-form-container">
        {/*  PromotionName */}
        <Form.Item label={<FormattedMessage id="Marketing.CampaignName" />}>
          {getFieldDecorator('marketingName', {
            initialValue: formData.BasicSetting.marketingName,
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
                      //  PromotionName
                      id: 'Marketing.CampaignName'
                    })
                  );
                }
              }
            ],
          })(
            <Input size="large" placeholder={(window as any).RCi18n({ id: 'Marketing.noMoreThan40Words' })}
              style={{ width: 350 }} />,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="Marketing.StartAndEndTime" />}>
          {getFieldDecorator('time', {
            initialValue: formData.BasicSetting.time,
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
        {/* 现暂时限制 MYVETRECO 不要 */}
        {Const.SITE_NAME !== 'MYVETRECO' && (
          <Form.Item label={<FormattedMessage id="Marketing.Description" />}>
            {getFieldDecorator('description', {
              initialValue: formData.BasicSetting.description,
              rules: [
                {
                  min: 0, max: 500, message:
                    (window as any).RCi18n({
                      id: 'Marketing.500Words'
                    })
                }
              ],
            })(
              <TextArea
                placeholder={(window as any).RCi18n({ id: 'Marketing.PleaseWriteDescriton' })}
                allowClear
                autoSize={{ minRows: 5, maxRows: 50 }}
                maxLength={500}
                style={{ width: 350 }}
              />

            )}
          </Form.Item>
        )}

      </Form>

      <ButtonLayer step={1} toNext={toNext} />
    </div>
  );
}
export default Form.create<any>()(Step2);