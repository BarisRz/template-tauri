import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

const Home = () => {
  const [lampState, setLampState] = useState(null);
  const [showRetry, setShowRetry] = useState(false);
  console.log(lampState);
  const fetchState = () => {
    setLampState(null);
    setShowRetry(false);

    const timer = setTimeout(() => setShowRetry(true), 5000);

    invoke("get_lamp_state")
      .then((state) => {
        clearTimeout(timer);
        setLampState(state);
      })
      .catch((err) => {
        clearTimeout(timer);
        console.error(err);
        setShowRetry(true);
      });
  };

  useEffect(() => {
    fetchState();
  }, []);

  return (
    <div>
      {lampState ? (
        <pre>{JSON.stringify(lampState, null, 2)}</pre>
      ) : showRetry ? (
        <button onClick={fetchState}>Réessayer</button>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Home;
