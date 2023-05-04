import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppWrapper = ({ children }: IProps) => {
    const { data: session, status } = useSession();
    const { events } = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('--------------------------------------------');
        console.log('Session data is');
        console.log({
            session,
        });
        console.log('--------------------------------------------');
    }, [session]);

    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };

        events.on('routeChangeStart', start);
        events.on('routeChangeComplete', end);
        events.on('routeChangeError', end);

        return () => {
            events.off('routeChangeStart', start);
            events.off('routeChangeComplete', end);
            events.off('routeChangeError', end);
        };
    }, [events]);

    if (status === 'loading' || loading) {
        return <PageLoader />;
    }

    return <Box className="h-screen">{children}</Box>;
};

export default AppWrapper;

interface IProps {
    children: JSX.Element[] | JSX.Element | null;
}

export const PageLoader = () => {
    return (
        <Box className="h-screen flex justify-center items-center">
            <CircularProgress />
        </Box>
    );
};
