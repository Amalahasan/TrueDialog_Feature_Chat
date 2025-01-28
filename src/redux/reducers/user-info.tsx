import { USER_INFO, ACTIVE_CONVERSATION_ID } from '../actions/user-info';

const initialState = {
  userInfo: {},
  conversationId: ''
};

const userInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_INFO:
      return { ...state, userInfo: action?.payload };
    case ACTIVE_CONVERSATION_ID:
      return { ...state, conversationId: action?.payload };
    default:
      return state;
  }
};

export default userInfoReducer;
