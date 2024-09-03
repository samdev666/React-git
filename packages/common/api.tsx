import { HttpMethods } from '@wizehub/common/utils';
import { getToken } from './redux/reducers/auth';

const PING = '/api/ping';
const LOGIN = '/api/saas-admin/login';

export const apiCall = (
  endpoint: string,
  method = HttpMethods.GET,
  body?: any,
  isFormData?: boolean,
): Promise<any> => {
  const headers = new Headers({
    Accept: 'application/json',
  });
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  const token = getToken();

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  let finalBody: string | null | undefined = body;

  if (body && !isFormData) {
    finalBody = JSON.stringify(body);
  }
  const url = endpoint;

  return new Promise<any>((resolve, reject) => {
    fetch(url, { body: finalBody, headers, method })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const ping = (): Promise<string> => apiCall(PING);

export const login = (formData: any): Promise<string> => apiCall(LOGIN, HttpMethods.POST, formData);
