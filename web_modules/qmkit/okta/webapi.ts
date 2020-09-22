import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function logout() {
    return Fetch<TResult>('/logout', {
        method: 'GET'
    });
}