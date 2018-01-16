import {
    POPULATE_FAVOURATE
} from '../actions/types';

const INITIAL_STATE = {
    favList : []
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case POPULATE_FAVOURATE:
            console.log(action.payload);
            return { ...state, favList : action.payload};

        default:
          return state;
    }
};
