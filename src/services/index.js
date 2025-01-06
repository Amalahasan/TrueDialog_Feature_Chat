import axios from 'axios';
const BASE_URL = 'https://api.truedialog.com/api/v2.1/';
export const CHAT_URL = 'https://ai-chat.truedialog.com/chat';

export const generateGUID = async () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getChatToken = async (accountId, userAuth) => {
  try {
    return await axios.get(
      BASE_URL + 'chattoken/' + accountId,
      userAuth,
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchUserInfo = async (email, password) => {
  try {
    return await axios.post(
      BASE_URL + 'userinfo',
      {},
      {
        auth: {
          username: email,
          password: password,
        },
      },
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchChatInfo = async (accountId, userAuth) => {
  try {
    return await axios.get(
      BASE_URL + 'account/' + accountId + '/inbox/0/conversation',
      userAuth,
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchContacts = async (accountId, userAuth) => {
  try {
    return await axios.get(
      BASE_URL + 'account/' + accountId + '/contact-short',
      userAuth,
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchChatDetails = async (accountId, id, userAuth) => {
  try {
    return await axios.get(
      BASE_URL + 'account/' + accountId + '/conversation/' + id + '/log',
      userAuth,
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
