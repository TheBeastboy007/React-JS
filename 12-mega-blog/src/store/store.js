import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        auth: (state = { user: null }, action) => {
            switch (action.type) {
                case 'auth/login':
                    return { ...state, user: action.payload.userData };
                case 'auth/logout':
                    return { ...state, user: null };
                default:
                    return state;
            }
        },
    }
});

export default store;