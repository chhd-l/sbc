import React from 'react';
import SubscriptionPlanUpdate from '../subscription-plan-update';

export default function SubscriptionPlanDetail(props: any) {
  //@ts-ignore
  return <SubscriptionPlanUpdate id={props.match.params.id} editable={false} />;
}
