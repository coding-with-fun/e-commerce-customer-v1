import { PageLoader } from '@/HOC/AppWrapper';
import env from '@/utils/env';
import { NextComponentType, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const authenticatedPage = (
    Component: NextComponentType<NextPageContext, any, {}>
) => {
    const AuthenticatedComponent = (props: any) => {
        const { status } = useSession();
        const { push, asPath } = useRouter();

        if (status === 'loading') {
            return <PageLoader />;
        }

        if (status === 'unauthenticated') {
            const url = env.baseURL + asPath;
            push(`/auth/signin?callbackUrl=${url}`);
            return;
        }

        return <Component {...props} />;
    };

    if (Component.getInitialProps) {
        AuthenticatedComponent.getInitialProps = Component.getInitialProps;
    }

    return AuthenticatedComponent;
};

export default authenticatedPage;
