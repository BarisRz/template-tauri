import { useOutletContext } from "react-router-dom";
import { Thermometer } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

function ColorSelect() {
  const { lampState, refetch } = useOutletContext();

  const colors = {
    white: { rgb: 16777215, hex: "#ffffff" },
    red: { rgb: 16739179, hex: "#ff6b6b" },
    blue: { rgb: 4569041, hex: "#45b7d1" },
    green: { rgb: 5361510, hex: "#51d96e" },
    yellow: { rgb: 16115299, hex: "#f5c563" },
  };

  const ctColors = {
    2000: "#ff8c3a",
    3000: "#ffb870",
    4000: "#ffd5a8",
    5000: "#ffecda",
    6500: "#f5f0ff",
  };

  const handleColorChange = (color) => {
    if (lampState.power === "off") {
      invoke("set_power", {
        power: lampState?.power === "on" ? "off" : "on",
      }).then(() => refetch());
    } else {
      invoke("set_rgb", {
        state: { ...lampState, rgb: colors[color].rgb },
      }).then(() => refetch());
    }
  };

  const handleCtChange = (ct) => {
    if (lampState.power === "off") {
      invoke("set_power", {
        power: lampState?.power === "on" ? "off" : "on",
      }).then(() => refetch());
    } else {
      invoke("set_ct", {
        state: { ...lampState, ct },
      }).then(() => refetch());
    }
  };

  return (
    <>
      <section className="flex justify-between text-sm font-semibold my-3">
        <div className="flex gap-2 grow">
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleColorChange("white")}
            style={{
              backgroundColor: lampState.power === "on" && colors.white.hex,
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleColorChange("red")}
            style={{
              backgroundColor: lampState.power === "on" && colors.red.hex,
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleColorChange("blue")}
            style={{
              backgroundColor: lampState.power === "on" && colors.blue.hex,
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleColorChange("green")}
            style={{
              backgroundColor: lampState.power === "on" && colors.green.hex,
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleColorChange("yellow")}
            style={{
              backgroundColor: lampState.power === "on" && colors.yellow.hex,
            }}
          />
        </div>
      </section>
      <section
        className={
          "flex flex-col gap-2 text-sm font-semibold " +
          (lampState?.power === "off" && "text-gray-700")
        }
      >
        <div className="flex my-1">
          <Thermometer className="w-5 h-5 -translate-x-0.5" />
          <p>Température</p>
        </div>
        <div className="flex gap-2 grow">
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleCtChange(2000)}
            style={{
              backgroundColor: lampState.power === "on" && ctColors[2000],
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleCtChange(3000)}
            style={{
              backgroundColor: lampState.power === "on" && ctColors[3000],
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleCtChange(4000)}
            style={{
              backgroundColor: lampState.power === "on" && ctColors[4000],
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleCtChange(5000)}
            style={{
              backgroundColor: lampState.power === "on" && ctColors[5000],
            }}
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
            onClick={() => handleCtChange(6500)}
            style={{
              backgroundColor: lampState.power === "on" && ctColors[6500],
            }}
          />
        </div>
      </section>
    </>
  );
}

export default ColorSelect;
