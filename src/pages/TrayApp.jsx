import "../App.css";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Bug } from "lucide-react";

import useLampState from "../hooks/useLampState";
import SwitchComponent from "../components/SwitchComponent";

function TrayApp() {
  const { data: lampState, isLoading, error, refetch } = useLampState();
  // Le contenu est masqué quand la fenêtre est cachée, puis rejoue l'animation à chaque ouverture
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unlisten = getCurrentWindow().onFocusChanged(({ payload: focused }) =>
      setIsOpen(focused),
    );
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <main className="bg-mainbg h-screen w-full overflow-hidden select-none p-3">
      <div
        className={
          "h-full flex flex-col gap-2 " +
          (isOpen ? "animate-tray-in" : "opacity-0")
        }
      >
        <header className="flex justify-end items-center gap-2 px-2">
          <button
            title="Ouvrir l'application"
            onClick={() => invoke("open_main_window")}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"
          />
          <button
            title="Quitter l'application"
            onClick={() => invoke("quit_app")}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
          />
        </header>

        {isLoading ? (
          <div className="section-primary flex-1 animate-pulse" />
        ) : error ? (
          <div className="section-primary flex-1 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Bug className="w-6 h-6 text-red-500" />
              <p className="text-sm font-medium">Lampe injoignable</p>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => refetch()}
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="section-primary flex-1">
            <SwitchComponent lampState={lampState} refetch={refetch} />
          </div>
        )}
      </div>
    </main>
  );
}

export default TrayApp;
