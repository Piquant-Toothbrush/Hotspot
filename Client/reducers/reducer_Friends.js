import { FETCH_FRIENDS } from '../actions/index';

const initialState = {
  currFriends: []
};

export default function(state = initialState, action) {
  switch (action.type) {
  
    case FETCH_FRIENDS:
      return {
        ...state,
        currFriends: action.payload.body.data
      };
    default:
      return state;
  }
}

