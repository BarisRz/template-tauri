import { Power, Lightbulb, Sparkles } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function SwitchComponent({ lampState, refetch }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex justify-between py-2">
        <div className="flex gap-2">
          <div className="w-14 h-14 bg-[#d8a253] rounded-xl flex items-center justify-center shadow-2xl shadow-[#d8a35367]">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col justify-center pl-2">
            <h2 className="text-lg font-medium">Lumière Principale</h2>
            <p className="text-sm text-gray-400">
              {lampState ? "Allumée" : "Éteinte"}
            </p>
          </div>
        </div>
        <div
          className={
            "w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all " +
            (lampState.power === "on"
              ? "bg-linear-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-400 hover:to-emerald-600/90 shadow-2xl shadow-emerald-500/30"
              : "bg-gray-500")
          }
          onClick={() =>
            invoke("set_power", {
              power: lampState?.power === "on" ? "off" : "on",
            }).then(() => refetch())
          }
        >
          <Power className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex flex-col gap-5 pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300 font-semibold">
              Luminosité
            </span>
          </div>
          <span className="text-sm text-gray-300 font-bold">
            {lampState.bright}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max="100"
          className="range w-full"
          onChange={(e) => {
            const newBrightness = parseInt(e.target.value);
            invoke("set_bright_rgb", {
              state: { ...lampState, bright: newBrightness },
            }).then(() => refetch());
          }}
        />
      </div>
    </div>
  );
}

export default SwitchComponent;
