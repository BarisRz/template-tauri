import { Palette, Pipette } from "lucide-react";
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
        <Palette className="w-4 h-4" /> Couleur
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
        <Pipette className="w-4 h-4" />
      </div>
    </section>
  );
}

export default ColorTitleSection2;
