import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../store';
import env from '@/utils/env';

export interface IInitialData {
    cartData: {
        [id: string]: number;
    };
}

const initialState: IInitialData = {
    cartData: {},
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartFromLocalStorage: (state) => {
            const localCartStringData = localStorage.getItem(env.redux.cartKey);
            const localCartData: IInitialData['cartData'] = localCartStringData
                ? JSON.parse(localCartStringData)
                : {};

            state.cartData = localCartData;
        },

        setCartFromAPI: (state, action) => {
            const cartData: IInitialData['cartData'] = _.get(
                action,
                'payload.cartData'
            );

            state.cartData = {
                ...state.cartData,
                ...cartData,
            };
        },

        addProductToCart: (state, action) => {
            const productID = _.get(action, 'payload.productID');
            const productQuantity = _.get(action, 'payload.productQuantity');

            if (productID && productQuantity) {
                const cartQuantity = state.cartData[productID];

                if (!cartQuantity) {
                    state.cartData[productID] = productQuantity;
                } else {
                    state.cartData[productID] += productQuantity;
                }

                localStorage.setItem(
                    env.redux.cartKey,
                    JSON.stringify(state.cartData)
                );
            }
        },

        removeProductFromCart: (state, action) => {
            const productID = _.get(action, 'payload.productID');
            const productQuantity = _.get(action, 'payload.productQuantity');

            if (productID) {
                const cartQuantity = state.cartData[productID];

                if (cartQuantity > 1) {
                    state.cartData[productID] -= productQuantity;

                    if (state.cartData[productID] < 1) {
                        delete state.cartData[productID];
                    }
                } else {
                    delete state.cartData[productID];
                }

                localStorage.setItem(
                    env.redux.cartKey,
                    JSON.stringify(state.cartData)
                );
            }
        },
    },
});

export const {
    setCartFromLocalStorage,
    setCartFromAPI,
    addProductToCart,
    removeProductFromCart,
} = CartSlice.actions;

export const cart = (state: RootState): IInitialData => state.cart;

export default CartSlice.reducer;
