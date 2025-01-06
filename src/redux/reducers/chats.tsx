import {CHAT_LIST} from '../actions/user-info';

const initialState = {
  chatList: {},
};

const chatListReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHAT_LIST:
      return {...state, chatList: action?.payload};
    default:
      return state;
  }
};

export default chatListReducer;
