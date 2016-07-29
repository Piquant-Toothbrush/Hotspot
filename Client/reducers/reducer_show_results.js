import { MAP_CONFIRM_POINT } from '../actions/index';
 import { FETCH_COLLECTION } from '../actions/index';
 
 
 const initialState = {
   collection: []
 };
 
 export default function(state = initialState, action) {
   switch (action.type) {
     case MAP_CONFIRM_POINT:
       return {
         ...state,
         collection: state.collection.concat(action.payload.body.data)
       };
     case FETCH_COLLECTION:
       return {
         ...state,
         collection: action.payload.body.data
       };
     default:
       return state;
   }
 }