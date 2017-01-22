import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import rootReducers from './reducers/root';
import middleware from './utils/middleware';
import ClientApp from './components/ClientApp';

const store = createStore(rootReducers, applyMiddleware(...middleware));

document.addEventListener('DOMContentLoaded', () => {
    render(
        <Provider store={store}>
            <ClientApp />
        </Provider>,
        document.getElementById('app'));
});
