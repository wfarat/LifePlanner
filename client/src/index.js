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
import Note from './features/notes/Note';
import Admin from './features/admin/Admin';
import Notes from './features/notes/Notes';
import AddNote from './components/AddNote/AddNote';
import AuthCheck from './components/authCheck/AuthCheck';
import DayTasks from './features/dayTasks/dayTasks';
import DayNotes from './features/dayNotes/DayNotes';
import AdminUser from './features/admin/AdminUser';
import IntlProviderWrapper from './context/IntlProviderWrapper';
import AddOneTimeTask from './components/AddOneTimeTask/AddOneTimeTask';
import Stats from './features/tasks/Stats';
import EditGoalTask from './components/EditGoalTask/EditGoalTask';

const container = document.getElementById('root');
const root = createRoot(container);
let persistor = persistStore(store);
const value = new Date();
let day = value.getDate();
if (day < 10) {
  day = '0' + day;
}
let month = value.getMonth() + 1;
if (month < 10) {
  month = '0' + month;
}
const year = value.getFullYear();
const dateString = `${year}${month}${day}`;
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="460759546213-jq918lrs8fvpg4h3213gdlit96fmlld0.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProviderWrapper>
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
                  <Route path="/" element={<Day today={dateString} />}>
                    <Route path="/" element={<DayTasks />} />
                    <Route path="/notes" element={<DayNotes />} />
                  </Route>
                  <Route path="user" element={<UserPage />} />
                  <Route path="day/:dayRef" element={<Day />}>
                    <Route path="/day/:dayRef" element={<DayTasks />} />
                    <Route
                      path="/day/:dayRef/:taskName"
                      element={<DayTasks />}
                    />
                    <Route path="/day/:dayRef/notes" element={<DayNotes />} />
                  </Route>
                  <Route path="user/password" element={<Password />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="tasks/:taskId" element={<Task />} />
                  <Route path="/one" element={<AddOneTimeTask />} />
                  <Route path="tasks/add" element={<AddTask />} />
                  <Route path="tasks/stats" element={<Stats />} />
                  <Route path="tasks/add/:goalId" element={<AddTask />} />
                  <Route path="tasks/add/day/:dayRef" element={<AddTask />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="goals/add" element={<AddGoal />} />
                  <Route path="goals/:goalId" element={<Goal />}>
                    <Route
                      path="/goals/:goalId/:goalTaskId/edit"
                      element={<EditGoalTask />}
                    />
                  </Route>
                  <Route path="user/notes" element={<Notes />} />
                  <Route path="user/notes/add" element={<AddNote />} />
                  <Route path="user/notes/:noteId" element={<Note />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="admin/:userId" element={<AdminUser />} />
                </Route>
              </Routes>
            </Router>
          </IntlProviderWrapper>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
