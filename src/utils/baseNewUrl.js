import { create } from 'apisauce';
const apiClientNew = create({
    baseURL: 'http://137.117.104.94:8080/api',
});
export default apiClientNew;

export const baseURL = 'http://137.117.104.94:8080/api';