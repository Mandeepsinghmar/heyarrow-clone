import { configureStore } from '@reduxjs/toolkit';
import * as reducer from './reducers';

export default configureStore({
  reducer: {
    ...reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
