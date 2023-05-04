import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { Fragment } from 'react';

const SignUp = () => {
    return (
        <Fragment>
            <Head>
                <title>Sign Up</title>
            </Head>

            <Box>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
            </Box>
        </Fragment>
    );
};

export default SignUp;
