import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from 'nookies';

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['meudinherim.token'];
  
    if(!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    try {
      return await fn(context);      
    } catch (error) {

      if (error.response.status === 404) {
        return {
          notFound: true,
        }
      }
      
      destroyCookie(context, 'meudinherim.token');

      return {
        redirect: {
          destination: '/',
          permanent: false
        },
      }
    }
  }
}