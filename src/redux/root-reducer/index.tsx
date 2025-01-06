import {combineReducers} from 'redux';
import userInfoReducer from '../reducers/user-info';
import userAuthReducer from '../reducers/user-auth';
import contactsReducer from '../reducers/contacts';
import chatsReducer from '../reducers/chats';
import chatDetailsReducer from '../reducers/chat-details';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  userAuth: userAuthReducer,
  contacts: contactsReducer,
  chatList: chatsReducer,
  chatDetails: chatDetailsReducer,
});

export default rootReducer;
