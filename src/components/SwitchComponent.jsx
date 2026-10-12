import { Power, Lightbulb, Sparkles, Thermometer } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import LampSlider from "./LampSlider";

function SwitchComponent({ lampState, refetch }) {
  // Toucher un slider rallume la lampe si elle est éteinte
  const turnOnThen = (command) => {
    if (lampState.power === "off") {
      invoke("set_power", { power: "on" }).then(() => refetch());
    }
    command().then(() => refetch());
  };

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
            "w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all  " +
            (lampState?.power === "on"
              ? "bg-linear-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-400 hover:to-emerald-600/90 shadow-2xl shadow-emerald-500/30"
              : "bg-gray-600 hover:bg-linear-to-br from-emerald-500/90 to-emerald-600/90 transition-colors")
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
      <LampSlider
        icon={Sparkles}
        label="Luminosité"
        unit="%"
        value={lampState.bright}
        min={1}
        max={100}
        onCommit={(bright) =>
          turnOnThen(() => invoke("set_bright", { state: { ...lampState, bright } }))
        }
      />
      <LampSlider
        icon={Thermometer}
        label="Température de couleur"
        unit="K"
        value={lampState.ct}
        min={1700}
        max={6500}
        step={100}
        onCommit={(ct) =>
          turnOnThen(() => invoke("set_ct", { state: { ...lampState, ct } }))
        }
      />
    </div>
  );
}

export default SwitchComponent;
