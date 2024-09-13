import { atob } from 'react-native-quick-base64';

export const decodeJWT = (token) => {
  try {
    // Split the JWT into its three parts
    const parts = token.split('.');

    // Ensure the token has three parts
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // Decode the payload (second part)
    let payload = parts[1];

    // Add padding if necessary (Base64 strings need to be a multiple of 4 in length)
    const paddedPayload = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');

    // Decode the base64url encoded payload
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    console.log(decodedPayload, "decodedPayload");

    // Parse the JSON string and return the payload object
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default decodeJWT;
