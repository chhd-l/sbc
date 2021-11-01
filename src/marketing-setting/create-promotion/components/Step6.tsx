import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import ButtonLayer from '@/marketing-setting/create-promotion/components/ButtonLayer';
import { FormContext } from '../index';
import { enumConst } from '../enum'
import { cache } from 'qmkit';

export default function Step6({ setLoading }) {
  const { formData } = useContext<any>(FormContext);
  return (
    <div>
      <div className="step-title">
        <FormattedMessage id="Marketing.Summary" />
      </div>
      <div className="step-summary">
        <div>
          <div>
            <div className="step-summary-title"><FormattedMessage id="Marketing.BasicSetting" /></div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.PromotionName" />:</div>
              <div className="step-summary-item-text">{formData.BasicSetting.marketingName}</div>
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.StartAndEndTime" />:</div>
              <div className="step-summary-item-text">{formData.BasicSetting.time?.[0]?.format('YYYY-MM-DD HH:mm')} - {formData.BasicSetting.time?.[1]?.format('YYYY-MM-DD HH:mm')}</div>
            </div>
          </div>

          <div>
            <div className="step-summary-title"><FormattedMessage id="Marketing.Conditions" /></div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.TypeOfPurchase" />:</div>
              <div className="step-summary-item-text">{enumConst.promotionType[formData.Conditions.promotionType]}</div>
            </div>
            {
              formData.Conditions.promotionType !== 2 && (
                <div className="step-summary-item">
                  <div className="step-summary-sub-title">Does it cummulate?:</div>
                  <div className="step-summary-item-text">{formData.Conditions.isSuperimposeSubscription === 0 ? 'Yes' : 'No'}</div>
                </div>
              )
            }

            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.GroupOfCustomer" />:</div>
              <div className="step-summary-item-text">{enumConst.joinLevel[formData.Advantage.joinLevel]}</div>
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.ProductsInTheCart" />:</div>
              <div className="step-summary-item-text">{enumConst.scopeType[formData.Advantage.scopeType]}</div>
            </div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.CartLimit" />:</div>
              <div className="step-summary-item-text">
                {enumConst.CartLimit[formData.Conditions.CartLimit]}
                { formData.Conditions.CartLimit === 1 && '('+formData.Conditions.fullMoney+sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)+')' }
                { formData.Conditions.CartLimit === 2 && '('+formData.Conditions.fullItem+' Item)' }
              </div>
            </div>
          </div>

        </div>
        <div>
          <div>
            <div className="step-summary-title"><FormattedMessage id="Marketing.PromotionType" /></div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title"><FormattedMessage id="Marketing.TypeOfPromotion" />:</div>
              <div className="step-summary-item-text">{enumConst.typeOfPromotion[formData.PromotionType.typeOfPromotion]}</div>
            </div>
            {
              formData.PromotionType.typeOfPromotion === 0 && (
                <>
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title"><FormattedMessage id="Marketing.CodesName" />:</div>
                    <div className="step-summary-item-text">{formData.PromotionType.promotionCode}</div>
                  </div>
                  {
                    formData.PromotionType.isNotLimit === 0 && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">Number of use:</div>
                        <div className="step-summary-item-text">{formData.PromotionType.perCustomer}</div>
                      </div>
                    )
                  }
                </>
              )
            }
          </div>

          <div>
            <div className="step-summary-title"><FormattedMessage id="Marketing.Advantage" /></div>
            <div className="step-summary-item">
              <div className="step-summary-sub-title">Advantage type:</div>
              <div className="step-summary-item-text">{enumConst.couponPromotionType[formData.Advantage.couponPromotionType]}</div>
            </div>

            {
              (formData.PromotionType.typeOfPromotion === 0 && (formData.Conditions.promotionType === 1 || formData.Conditions.promotionType === 2)) ? (
                <>
                  { formData.Advantage.couponPromotionType === 0 &&
                    (
                      <>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">First subscription order reduction:</div>
                          <div className="step-summary-item-text">{formData.Advantage.firstSubscriptionOrderReduction + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) }</div>
                        </div>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">Rest subscription order reduction:</div>
                          <div className="step-summary-item-text">{formData.Advantage.restSubscriptionOrderReduction + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) }</div>
                        </div>
                      </>
                    )
                  }
                  { formData.Advantage.couponPromotionType === 1 &&
                    (
                      <>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">First subscription order discount:</div>
                          <div className="step-summary-item-text">{formData.Advantage.firstSubscriptionOrderDiscount + '%' }</div>
                        </div>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">First subscription limit amount:</div>
                          <div className="step-summary-item-text">{formData.Advantage.firstSubscriptionLimitAmount + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) }</div>
                        </div>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">Rest subscription order discount:</div>
                          <div className="step-summary-item-text">{formData.Advantage.restSubscriptionOrderDiscount + '%' }</div>
                        </div>
                        <div className="step-summary-item">
                          <div className="step-summary-sub-title">Rest subscription limit amount:</div>
                          <div className="step-summary-item-text">{formData.Advantage.restSubscriptionLimitAmount + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) }</div>
                        </div>
                      </>
                    )
                  }
                </>
              ) : (
                <>
                  <div className="step-summary-item">
                    <div className="step-summary-sub-title">
                      {
                        formData.PromotionType.typeOfPromotion === 1 ? <FormattedMessage id="Marketing.CouponValue" />
                          : <FormattedMessage id="Marketing.PromotionValue" />
                      }
                      :</div>
                    <div className="step-summary-item-text">
                      {formData.Advantage.couponPromotionType === 0 && formData.Advantage.denomination + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) }
                      {formData.Advantage.couponPromotionType === 1 && formData.Advantage.couponDiscount+'%' }
                    </div>
                  </div>

                  {
                    formData.Advantage.couponPromotionType === 1 && (
                      <div className="step-summary-item">
                        <div className="step-summary-sub-title">Discount Limit:</div>
                        <div className="step-summary-item-text">{formData.Advantage.limitAmount}{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</div>
                      </div>
                    )
                  }
                </>
              )
            }
          </div>
        </div>
      </div>
      <ButtonLayer step={5} noForm={true} setLoading={setLoading}/>
    </div>
  );
}