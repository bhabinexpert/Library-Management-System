import { Loader2 } from "lucide-react";

export function OperationLoader({ operation }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-800 font-medium">
          {operation === 'borrow' 
            ? 'Processing your borrow request...' 
            : 'Returning your book...'}
        </p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
}