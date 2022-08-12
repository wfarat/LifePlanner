import userSlice from '../features/users/userSlice';

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import daySlice from '../features/day/daySlice';
import tasksSlice from '../features/tasks/tasksSlice';
import goalsSlice from '../features/Goals/goalsSlice';
import dayNotesSlice from '../features/dayNotes/dayNotesSlice';
import dayTasksSlice from '../features/dayTasks/dayTasksSlice';

const appReducer = combineReducers({
  user: userSlice,
  day: daySlice,
  tasks: tasksSlice,
  goals: goalsSlice,
  dayNotes: dayNotesSlice,
  dayTasks: dayTasksSlice,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    storage.removeItem('persist:root');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
