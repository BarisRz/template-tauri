import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useQuery } from "@tanstack/react-query";

// Chaque fenêtre a son propre cache : on recharge l'état quand elle reprend le focus
// pour rester synchronisé avec les changements faits depuis l'autre fenêtre.
function useLampState() {
  const query = useQuery({
    queryKey: ["lampState"],
    queryFn: () => invoke("get_lamp_state"),
    retry: false,
  });
  const { refetch } = query;

  useEffect(() => {
    const unlisten = getCurrentWindow().onFocusChanged(({ payload: focused }) => {
      if (focused) refetch();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [refetch]);

  return query;
}

export default useLampState;
