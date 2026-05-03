import TitleBar from "../components/TitleBar";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-mainbg">
      <TitleBar />
      <div className="flex-1 p-4">{/* ton contenu ici */}</div>
    </div>
  );
};

export default Home;
