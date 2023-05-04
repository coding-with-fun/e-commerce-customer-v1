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
    },
});

export const { setProducts } = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
