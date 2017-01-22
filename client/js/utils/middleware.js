const loggerMiddleware = ({ getState }) => next => action => {
    console.debug('Dispatched action:', action);
    let nextAction = next(action);
    console.debug('State after dispatching:', getState());
    return nextAction;
};

export default [
    loggerMiddleware
];
