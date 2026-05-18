import { Power, Lightbulb, Sparkles, Thermometer } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function SwitchComponent({ lampState, refetch }) {
  return (
    <div
      className={
        "flex flex-col h-full justify-between transition-colors " +
        (lampState?.power === "off" && "text-gray-700")
      }
    >
      <section className="flex justify-between py-2">
        <div className="flex gap-2">
          <div
            className={
              "w-14 h-14  rounded-xl flex items-center justify-center transition-all " +
              (lampState?.power === "on"
                ? "bg-[#d8a253]  shadow-lg shadow-yellow-400/50"
                : "bg-gray-600")
            }
          >
            <Lightbulb
              className={
                "w-6 h-6 " +
                (lampState?.power === "on" ? "text-white" : "text-black")
              }
            />
          </div>
          <div className="flex flex-col justify-center pl-2">
            <h2 className="text-lg font-medium">Lumière Principale</h2>
            <p className="text-sm">
              {lampState?.power === "on" ? "Allumée" : "Éteinte"}
            </p>
          </div>
        </div>
        <div
          className={
            "w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all " +
            (lampState?.power === "on"
              ? "bg-linear-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-400 hover:to-emerald-600/90 shadow-2xl shadow-emerald-500/30"
              : "bg-gray-600")
          }
          onClick={() =>
            invoke("set_power", {
              power: lampState?.power === "on" ? "off" : "on",
            }).then(() => refetch())
          }
        >
          <Power
            className={
              "w-5 h-5 " +
              (lampState?.power === "on" ? "text-white" : "text-black ")
            }
          />
        </div>
      </section>
      <section className="flex flex-col gap-2 my-2 hover:text-white transition-colors">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Luminosité</span>
          </div>
          <span className="text-sm font-bold">{lampState.bright}%</span>
        </div>
        <input
          key={lampState.bright}
          type="range"
          min={1}
          max={100}
          className="range w-full"
          defaultValue={lampState.bright}
          onMouseUp={(e) => {
            if (lampState.power === "off") {
              invoke("set_power", { power: "on" }).then(() => refetch());
            }
            invoke("set_bright", {
              state: { ...lampState, bright: parseInt(e.target.value) },
            }).then(() => refetch());
          }}
        />
      </section>
      <section className="flex flex-col gap-2 mt-2 mb-1 hover:text-white transition-colors">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Température de couleur
            </span>
          </div>
          <span className="text-sm font-bold">{lampState.ct}K</span>
        </div>
        <input
          key={lampState.ct}
          type="range"
          min={1700}
          max={6500}
          defaultValue={lampState.ct}
          className="range w-full"
          list="ct-checkpoints"
          step={100}
          onMouseUp={(e) => {
            if (lampState.power === "off") {
              invoke("set_power", { power: "on" }).then(() => refetch());
            }
            invoke("set_ct", {
              state: { ...lampState, ct: parseInt(e.target.value) },
            }).then(() => refetch());
          }}
        />
        <datalist id="ct-checkpoints">
          <option value={4000} />
        </datalist>
      </section>
    </div>
  );
}

export default SwitchComponent;
