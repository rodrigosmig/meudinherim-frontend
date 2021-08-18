import { setupApiClient } from '../services/api';
import { withSSRAuth } from '../utils/withSSRAuth';
import { Layout } from '../components/Layout';
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Meu Dinherim</title>
      </Head>

      <Layout>
        <>
          <h1>Dashboard</h1>
        </>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get('/auth/me');

  return {
    props: {}
  }
})