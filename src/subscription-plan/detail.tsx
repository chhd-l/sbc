import React from 'react';
import Subscription from '../subscription-plan-update';

export default function SubscriptionDetail(props: any) {
  //@ts-ignore
  return <Subscription id={props.match.params.id} editable={false} />;
}
