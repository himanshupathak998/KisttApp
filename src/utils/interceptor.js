import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'apisauce';

const apiClient = create({
  baseURL: 'https://msme.suryodaybank.co.in/api',
});

apiClient.addAsyncRequestTransform(async request => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching token from AsyncStorage:', error);
  }
});

export default apiClient;
