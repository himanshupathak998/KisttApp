import { create } from 'apisauce';
const apiClientNoJwtHeaders = create({
  baseURL: 'https://msme.suryodaybank.co.in/api',
});
export default apiClientNoJwtHeaders;
export const apiKey = 'kyqak5muymxcrjhc5q57vz9v'
export const enachApi = 'https://sandbox-hog.paycorp.io/gateway';
export const apiHeaderKey = 'ab5a4552-2412-4724-a254-18a05e722e3d';
export const vkyc_group_id = '174508';
export const release_certificate_hash_value = 'EYYIWWimZ7cs93noUPqMZKaMqTq+JptpYXFjINaJ47a5';
export const team_id = '4R9CPV5X7G';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-api-key': 'ab5a4552-2412-4724-a254-18a05e722e3d'
  }
};

export const vkycHeaders = getHeaders();