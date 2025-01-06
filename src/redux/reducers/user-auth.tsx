import {USER_AUTH} from '../actions/user-info';

const initialState = {
  userAuth: {},
};

const userAuthReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_AUTH:
      return {...state, userAuth: action?.payload};
    default:
      return state;
  }
};

export default userAuthReducer;
