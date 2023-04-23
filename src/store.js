import { configureStore } from '@reduxjs/toolkit';

import logger from 'redux-logger';

import * as api from './api';

import { filterReducer } from './features/Filters/filterSlice';
import { todoReducer } from './features/Todos/todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
  devTools: true,
  middleware: (getDeafaultMiddleware) =>
    getDeafaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }).concat(logger),
  preloadedState: {},
  enhancers: [],
});
