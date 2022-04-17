import Head from 'next/head';
import Image from 'next/image';
import Header from '../Components/Header';
import Feed from '../Components/Feed';
import Modal from '../Components/Modal';
const Home = () => {
  return (
    <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Feed />
      <Modal />
    </div>
  );
};

export default Home;
