export function InlineFetchingIndicator() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-gray-800/80 backdrop-blur-sm rounded-md shadow-md">
      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" aria-hidden />
      <span className="text-xs text-white">Atualizando...</span>
    </div>
  );
}