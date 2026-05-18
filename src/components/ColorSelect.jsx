import { useOutletContext } from "react-router-dom";
import { Thermometer } from "lucide-react";

function ColorSelect() {
  const { lampState, refetch } = useOutletContext();

  return (
    <>
      <section className="flex justify-between text-sm font-semibold my-3">
        <div className="flex gap-2 grow">
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
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
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
          <button
            className={
              "bouton-colorselect " +
              (lampState.power === "off" && "bg-gray-600")
            }
          />
        </div>
      </section>
    </>
  );
}

export default ColorSelect;
