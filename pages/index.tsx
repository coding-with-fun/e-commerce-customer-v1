import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';

const Home = () => {
    return (
        <Fragment>
            <Head>
                <title>Home</title>
            </Head>

            <Box>
                <Typography component="h1" variant="h5">
                    Home
                </Typography>
            </Box>
        </Fragment>
    );
};

export default Home;
