import { Palette } from "lucide-react";

import Error from "./Error";
import SwitchComponent from "../components/SwitchComponent";
import ColorSelect from "../components/ColorSelect";
import Skeleton from "../components/Skeleton";
import useLampState from "../hooks/useLampState";

function Home() {
  const { data: lampState, isLoading, refetch } = useLampState();

  if (isLoading) {
    return <Skeleton />;
  }

  // Une erreur pendant un rechargement en arrière-plan garde le dernier état connu
  if (!lampState) {
    return <Error refetch={refetch} />;
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="section-primary">
        <SwitchComponent lampState={lampState} refetch={refetch} />
      </div>

      <div className="section-primary">
        <div
          className={
            "flex gap-2 items-center text-sm font-semibold " +
            (lampState.power === "off" && "text-gray-700")
          }
        >
          <Palette className="w-4 h-4" />
          Couleur
        </div>
        <ColorSelect lampState={lampState} refetch={refetch} />
      </div>
    </div>
  );
}

export default Home;
