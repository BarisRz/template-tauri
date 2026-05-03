import { getCurrentWindow } from "@tauri-apps/api/window";

const TitleBar = () => {
  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className="h-10 flex items-center justify-end px-4 select-none cursor-grab"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => appWindow.minimize()}
          className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors cursor-pointer"
        />
        <button
          onClick={() => appWindow.close()}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
};

export default TitleBar;
