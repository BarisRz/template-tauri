import { invoke } from "@tauri-apps/api/core";
import { useQuery } from "@tanstack/react-query";

import Error from "./Error";
import ColorSelect from "../components/ColorSelect";
import SwitchComponent from "../components/SwitchComponent";
import Theme from "../components/Theme";
import Skeleton from "../components/Skeleton";

function Home() {
  const {
    data: lampState,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lampState"],
    queryFn: () => invoke("get_lamp_state"),
    retry: false,
  });

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return <Error />;
  }
  console.log("Lamp State:", lampState);
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="section-primary">
        <SwitchComponent lampState={lampState} refetch={refetch} />
      </div>
      {/* <div className="section-primary">
        <ColorSelect />
      </div>
      <div className="section-primary">
        <Theme />
      </div>
      <pre>{JSON.stringify(lampState, null, 2)}</pre> */}
    </div>
  );
}

export default Home;

// {
//   "power": "on",
//   "bright": 1,
//   "color_mode": 2,
//   "ct": 4000,
//   "rgb": 16711680,
//   "hue": 359,
//   "sat": 100
// }

// {
//         "title": "Light Hub",
//         "width": 470,
//         "height": 780,
//         "maxWidth": 470,
//         "maxHeight": 780,
//         "center": true,
//         "resizable": false,
//         "fullscreen": false,
//         "maximizable": false,
//         "decorations": false,
//         "backgroundColor": "#0d0f16"
//       }
