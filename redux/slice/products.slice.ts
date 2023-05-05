import { productListResponse } from '@/pages/api/product/list';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IInitialData {
    products: productListResponse[];
}

const initialState: IInitialData = {
    products: [],
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
    },
});

export const { setProducts, toggleFavoriteProduct } = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
