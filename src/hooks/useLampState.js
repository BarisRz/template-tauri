import { invoke } from "@tauri-apps/api/core";
import { useQuery } from "@tanstack/react-query";

// L'état est rechargé régulièrement et au retour sur l'app,
// pour refléter les changements faits depuis le Quick Settings.
function useLampState() {
  return useQuery({
    queryKey: ["lampState"],
    queryFn: () => invoke("get_lamp_state"),
    retry: false,
    refetchInterval: 5000,
  });
}

export default useLampState;
