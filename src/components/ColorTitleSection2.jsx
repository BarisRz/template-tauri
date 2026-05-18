import { Palette, Pipette } from "lucide-react";
function ColorTitleSection2({ lampState }) {
  return (
    <section
      className={
        "flex justify-between text-sm font-semibold " +
        (lampState?.power === "off" && "text-gray-700")
      }
    >
      <div className="flex gap-2 items-center">
        <Palette className="w-4 h-4" /> Couleur
      </div>
      <div className="flex items-center gap-2 rounded-3xl">
        <Pipette className="w-4 h-4" /> Custom
      </div>
    </section>
  );
}

export default ColorTitleSection2;
