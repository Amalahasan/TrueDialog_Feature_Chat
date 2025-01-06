import {USER_INFO} from '../actions/user-info';

const initialState = {
  userInfo: {},
};

const userInfoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_INFO:
      return {...state, userInfo: action?.payload};
    default:
      return state;
  }
};

export default userInfoReducer;
