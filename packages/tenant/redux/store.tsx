import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import createRootReducer from './reducers';
import { rootSaga } from './sagas';
import storage from 'redux-persist/lib/storage';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tenantData', 'tenantGroup'],
};

const rootReducer = createRootReducer(history);
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: [sagaMiddleware, routerMiddleware(history)],
});

const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);
export { store, persistor };
