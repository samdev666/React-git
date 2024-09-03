import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import { rootSaga } from './sagas';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  devTools: true,
  reducer: createRootReducer(history),
  middleware: [sagaMiddleware, routerMiddleware(history)],
});

sagaMiddleware.run(rootSaga);

export default store;
