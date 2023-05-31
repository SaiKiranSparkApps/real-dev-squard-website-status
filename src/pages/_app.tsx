import { FC, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import IsUserAuthorizedContext from '@/context/isUserAuthorized';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/index.scss';
import { useRouter } from "next/router";

if (process.env.NEXT_PUBLIC_API_MOCKING === 'ON') {
    require('../../__mocks__/index');
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
    const rdxStore = store();
    const router = useRouter();

    useEffect(() => {
      router.push("/?dev=true");
    }, []);
    return (
        <Provider store={rdxStore}>
            <IsUserAuthorizedContext>
                <ToastContainer />
                <Component {...pageProps} />
            </IsUserAuthorizedContext>
        </Provider>
    );
};

export default MyApp;
