import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { productListResponse } from '@/pages/api/product/list';
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';

const Product = (props: IProps) => {
    const { product } = props;
    console.log(product);

    const [isImageLoading, setIsImageLoading] = useState(true);

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                minHeight: '266px',
                minWidth: '337px',
            }}
        >
            <Box
                sx={{
                    height: '10rem',
                    width: '100%',
                    display: isImageLoading ? 'none' : 'block',
                }}
            >
                <img
                    src={product.coverImage}
                    alt={product.title}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                    }}
                    onLoad={() => {
                        setIsImageLoading(false);
                    }}
                />
            </Box>

            <Skeleton
                variant="rounded"
                width={303}
                height={160}
                sx={{
                    display: isImageLoading ? 'block' : 'none',
                }}
            />

            <Box className="relative h-40">
                <Image
                    priority
                    fill
                    src={product.coverImage || ''}
                    alt={product.title}
                    sizes="160px"
                    style={{
                        objectFit: 'contain',
                        display: isImageLoading ? 'none' : 'block',
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={'100%'}
                    height={'100%'}
                    sx={{
                        display: isImageLoading ? 'block' : 'none',
                        marginX: 'auto',
                    }}
                />
            </Box>

            <Typography
                className="product-title"
                sx={{
                    marginTop: '1rem',
                }}
            >
                {product.title}
            </Typography>
            <Typography variant="body2">by {product.seller?.name}</Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        <Rating
                            name="product-rating"
                            value={product.ratings}
                            precision={0.5}
                            readOnly
                        />

                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                            }}
                        >
                            {product.totalRatings}
                        </Typography>
                    </Box>

                    <Typography>₹{product.price}</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <IconButton aria-label="removeFromCart">
                        <RemoveIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            cursor: 'text',
                            userSelect: 'none',
                        }}
                    >
                        0
                    </Typography>

                    <IconButton aria-label="addToCart">
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default Product;

interface IProps {
    product: productListResponse;
}
