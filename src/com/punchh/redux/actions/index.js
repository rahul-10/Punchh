import {
  POPULATE_FAVOURATE
} from './types';

export const populateFavouarte = (arrayList) => ({
  type: POPULATE_FAVOURATE,
  payload: arrayList
});
