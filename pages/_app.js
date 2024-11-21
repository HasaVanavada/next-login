import { SessionProvider } from 'next-auth/react'; // Import the SessionProvider
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context); // Get the session on the server side

  return {
    props: {
      session, // This will be passed to your page and automatically injected into SessionProvider
    },
  };
}
export default MyApp;