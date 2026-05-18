import { Palette, Pipette, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
function ColorTitleSection2({ lampState }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <section
      className={
        "flex justify-between text-sm font-semibold " +
        (lampState?.power === "off" && "text-gray-700")
      }
    >
      <div className="flex gap-2 items-center">
        <Palette className="w-4 h-4" />
        {location.pathname === "/" ? "Couleur" : "Couleur personnalisée"}
      </div>
      <div
        className="flex items-center gap-2 rounded-3xl"
        onClick={() => {
          if (location.pathname === "/") {
            navigate("/color-wheel");
          } else {
            navigate("/");
          }
        }}
      >
        {location.pathname !== "/" ? (
          <ArrowLeft className="w-5 h-5 cursor-pointer hover:scale-125 transition-all" />
        ) : (
          <Pipette className="w-4 h-4 cursor-pointer hover:scale-125 transition-all" />
        )}
      </div>
    </section>
  );
}

export default ColorTitleSection2;
