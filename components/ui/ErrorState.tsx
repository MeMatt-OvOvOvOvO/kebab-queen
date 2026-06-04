import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "Coś poszło nie tak", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#FFF0F6" }}>
        <AlertCircle size={28} style={{ color: "#F0147A" }} />
      </div>
      <div>
        <p className="font-bold text-gray-900">{message}</p>
        <p className="text-sm text-gray-400 mt-1">Sprawdź połączenie i spróbuj ponownie</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "#F0147A", color: "white" }}
        >
          <RefreshCw size={14} />
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
