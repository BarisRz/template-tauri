import { Bug } from "lucide-react";

export default function Error({ refetch }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 px-6 text-center">
      <div className="flex items-center gap-4">
        <Bug className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-medium text-text-primary">
          Lampe injoignable
        </h1>
      </div>
      <p className="text-gray-400">
        Vérifiez que la lampe est alimentée et que vous êtes sur le même réseau
        Wi-Fi.
      </p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        onClick={() => refetch()}
      >
        Réessayer
      </button>
    </div>
  );
}
