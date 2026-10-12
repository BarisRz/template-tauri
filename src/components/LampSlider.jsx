import { useEffect, useRef, useState } from "react";

// Slider qui affiche la valeur en direct et n'envoie la commande qu'au relâchement,
// au doigt comme à la souris.
function LampSlider({ icon: Icon, label, unit, value, onCommit, ...inputProps }) {
  const [current, setCurrent] = useState(value);
  const lastCommitted = useRef(value);

  useEffect(() => {
    setCurrent(value);
    lastCommitted.current = value;
  }, [value]);

  const commit = (e) => {
    const next = parseInt(e.target.value);
    if (next === lastCommitted.current) return;
    lastCommitted.current = next;
    onCommit(next);
  };

  return (
    <section className="flex flex-col gap-2 my-2 hover:text-white transition-colors">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-sm font-bold">
          {current}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className="range w-full"
        value={current}
        onChange={(e) => setCurrent(parseInt(e.target.value))}
        onPointerUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
        {...inputProps}
      />
    </section>
  );
}

export default LampSlider;
