import env from '@/utils/env';
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../store';
import { productListResponse } from '@/pages/api/product/list';

export interface IInitialData {
    cartData: {
        [id: string]: productListResponse & {
            cartQuantity: number;
        };
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
            const product = _.get(action, 'payload.product');
            const productQuantity = _.get(action, 'payload.productQuantity');

            if (product.id && productQuantity) {
                const cartItem = state.cartData[product.id];

                if (!cartItem) {
                    state.cartData[product.id] = {
                        ...product,
                        cartQuantity: productQuantity,
                    };
                } else {
                    state.cartData[product.id].cartQuantity += productQuantity;
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
                const cartItem = state.cartData[productID];

                if (cartItem.cartQuantity > 1) {
                    cartItem.cartQuantity -= productQuantity;

                    if (cartItem.cartQuantity < 1) {
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

        setProductToCart: (state, action) => {
            const productID = _.get(action, 'payload.productID');
            const productQuantity = _.get(action, 'payload.productQuantity');

            if (productID) {
                if (productQuantity) {
                    state.cartData[productID].cartQuantity = productQuantity;
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
    setProductToCart,
} = CartSlice.actions;

export const cart = (state: RootState): IInitialData => state.cart;

export default CartSlice.reducer;
