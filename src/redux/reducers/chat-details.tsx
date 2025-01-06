import {CHAT_DETAILS} from '../actions/user-info';

const initialState = {
  chatDetails: [],
};

const chatDetailsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHAT_DETAILS:
      return {...state, [action?.payload?.id]: action?.payload?.data};
    default:
      return state;
  }
};

export default chatDetailsReducer;
