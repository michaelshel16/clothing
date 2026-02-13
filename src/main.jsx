import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import itemReducer from './state/States.jsx';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {

  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER


} from "redux-persist";
import  storage  from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig    = {key:'root', storage, version:1}

const persistedReducer = persistReducer(persistConfig,itemReducer)
 
export const store = configureStore(
  {
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
     
      },
    }),
  });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <App />
      </PersistGate>
    </Provider>
    </BrowserRouter>
  
  </StrictMode>,
)
