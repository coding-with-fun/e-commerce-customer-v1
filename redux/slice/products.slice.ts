import { productListResponse } from '@/pages/api/product/list';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import _ from 'lodash';

export type cartProduct = productListResponse & {
    inCart: number;
};

export interface IInitialData {
    products: productListResponse[];
    cartData: {
        [id: string]: cartProduct;
    };
}

const initialState: IInitialData = {
    products: [],
    cartData: {},
};

const ProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            const payload = action.payload as {
                products: productListResponse[];
            };
            state.products = [...payload.products];
        },

        toggleFavoriteProduct: (state, action) => {
            const payload = action.payload as {
                id: number;
            };

            const index = state.products.findIndex(
                (el) => el.id === payload.id
            );
            state.products[index].isFavorite =
                !state.products[index].isFavorite;
        },

        addProductToCart: (state, action) => {
            const productID = _.get(action, 'payload.productID');

            if (productID) {
                const product = state.cartData[productID];
                let productInDatabase: productListResponse | undefined;

                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i].id === productID) {
                        productInDatabase = state.products[i];
                        break;
                    }
                }

                if (productInDatabase) {
                    if (!product) {
                        state.cartData = {
                            ...state.cartData,
                            [productID]: {
                                ...productInDatabase,
                                inCart: 1,
                            },
                        };
                    } else {
                        if (
                            state.cartData[productID].inCart <
                            productInDatabase.quantity
                        ) {
                            state.cartData[productID].inCart += 1;
                        }
                    }
                }
            }
        },

        removeProductFromCart: (state, action) => {
            const productID = _.get(action, 'payload.productID');

            if (productID) {
                const product = state.cartData[productID];

                if (product) {
                    if (product.inCart === 1) {
                        delete state.cartData[productID];
                    } else {
                        state.cartData[productID].inCart -= 1;
                    }
                }
            }
        },
    },
});

export const {
    setProducts,
    toggleFavoriteProduct,
    addProductToCart,
    removeProductFromCart,
} = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
