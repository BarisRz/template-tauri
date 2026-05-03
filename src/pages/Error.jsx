import { Bug } from "lucide-react";

export default function Error() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen-minus-40 gap-4">
        <div className="flex items-center gap-4">
          <Bug className="w-12 h-12 text-red-500" />
          <h1 className="text-xl font-medium">
            Oups ! Une erreur est survenue.
          </h1>
        </div>
        <p className="text-gray-400">
          Faites <span className="font-bold text-white">F5</span> pour recharger
          la page.
        </p>
      </div>
    </>
  );
}
