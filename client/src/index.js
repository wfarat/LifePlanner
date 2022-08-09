import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/Login/Login';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import UserPage from './components/UserPage/UserPage';
import Password from './components/Password/Password';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Register from './components/Register/Register';
import CalendarPage from './components/CalendarPage/CalendarPage';
import Day from './features/day/Day';
import AddTask from './components/AddTask/AddTask';
import Goal from './features/Goals/Goal';
import AddGoal from './components/AddGoal/AddGoal';
import Goals from './features/Goals/Goals';
import Tasks from './features/tasks/Tasks';
import Task from './features/tasks/Task';
import AuthCheck from './components/authCheck/AuthCheck';
const container = document.getElementById('root');
const root = createRoot(container);
let persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="460759546213-jq918lrs8fvpg4h3213gdlit96fmlld0.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              <Route
                path="/"
                element={
                  <AuthCheck>
                    <App />
                  </AuthCheck>
                }
              >
                <Route path="user" element={<UserPage />} />
                <Route path="day/:dayRef" element={<Day />} />
                <Route path="user/password" element={<Password />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/:taskId" element={<Task />} />
                <Route path="tasks/add" element={<AddTask />} />
                <Route path="tasks/add/:goalId" element={<AddTask />} />
                <Route path="goals" element={<Goals />} />
                <Route path="goals/add" element={<AddGoal />} />
                <Route path="goals/:goalId" element={<Goal />} />
                <Route path="calendar" element={<CalendarPage />} />
              </Route>
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
