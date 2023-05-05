import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../store';

export interface IInitialData {
    cartData: {
        [id: string]: number;
    };
    updatingCart: boolean;
}

const initialState: IInitialData = {
    cartData: {},
    updatingCart: false,
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state, action) => {
            state.updatingCart = true;
            const productID = _.get(action, 'payload.productID');
            const productQuantity = _.get(action, 'payload.productQuantity');

            if (productID && productQuantity) {
                const cart = state.cartData[productID];

                if (!cart) {
                    state.cartData[productID] = 1;
                } else if (cart < productQuantity) {
                    state.cartData[productID] += 1;
                }
            }

            state.updatingCart = false;
        },

        removeProductFromCart: (state, action) => {
            state.updatingCart = true;
            const productID = _.get(action, 'payload.productID');

            if (productID) {
                const cart = state.cartData[productID];

                if (cart > 1) {
                    state.cartData[productID] -= 1;
                } else {
                    delete state.cartData[productID];
                }
            }

            state.updatingCart = false;
        },
    },
});

export const { addProductToCart, removeProductFromCart } = CartSlice.actions;

export const cart = (state: RootState): IInitialData => state.cart;

export default CartSlice.reducer;
