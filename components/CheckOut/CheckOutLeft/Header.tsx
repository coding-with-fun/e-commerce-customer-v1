import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

const Header = () => {
    return (
        <Box className="flex items-center">
            <Link href="/cart" className="text-sm">
                Cart
            </Link>

            <KeyboardArrowRightIcon className="text-sm mx-2" />

            <Typography className="text-sm">Information</Typography>

            <KeyboardArrowRightIcon className="text-sm mx-2" />

            <Typography className="text-sm">Shipping</Typography>

            <KeyboardArrowRightIcon className="text-sm mx-2" />

            <Typography className="text-sm">Payment</Typography>
        </Box>
    );
};

export default Header;
