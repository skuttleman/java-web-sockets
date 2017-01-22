import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import rootReducers from './reducers/root';
import middleware from './utils/middleware';
import ManagerApp from './components/ManagerApp';

const store = createStore(rootReducers, applyMiddleware(...middleware));

document.addEventListener('DOMContentLoaded', () => {
    render(
        <Provider store={store}>
            <ManagerApp />
        </Provider>,
        document.getElementById('app'));
});
