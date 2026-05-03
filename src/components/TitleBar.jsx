import { getCurrentWindow } from "@tauri-apps/api/window";

const TitleBar = ({ title }) => {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className="h-8 bg-zinc-900 flex items-center justify-between px-4 select-none"
    >
      <span data-tauri-drag-region className="text-white text-sm font-medium">
        {title}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => appWindow.minimize()}
          className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors"
        />
        <button
          onClick={() => appWindow.close()}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
        />
      </div>
    </div>
  );
};

export default TitleBar;
