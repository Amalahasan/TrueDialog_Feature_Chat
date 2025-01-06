import {CONTACTS} from '../actions/user-info';

const initialState = {
  contacts: {},
};

const contactsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CONTACTS:
      return {...state, contacts: action?.payload};
    default:
      return state;
  }
};

export default contactsReducer;
