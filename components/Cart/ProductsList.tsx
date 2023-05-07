import { cartProduct } from '@/pages/api/cart/get-products';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import Product from './Product';

const ProductsList = ({ products }: IProps) => {
    return (
        <Box>
            <Box>
                <Typography>Your cart</Typography>

                <Link href="/">
                    <Typography>Continue shopping</Typography>
                </Link>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th scope="col" className="text-left">
                                Product
                            </th>

                            <th scope="col" className="text-left">
                                Quantity
                            </th>

                            <th scope="col" className="text-right">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            return (
                                <Product product={product} key={product.id} />
                            );
                        })}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default ProductsList;

interface IProps {
    products: cartProduct[];
}
