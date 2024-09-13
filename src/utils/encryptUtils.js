import "react-native-get-random-values";
import CryptoJS from 'crypto-js';

export const encryptObjectData = (data,apiHeaderKey) => {
  try {
    const jsonData = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(jsonData, apiHeaderKey).toString();
    return ciphertext;
  } catch (error) {
    console.error('Encryption Error:', error);
  }
};