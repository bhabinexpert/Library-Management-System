import { Loader2 } from "lucide-react";

export function InitialLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="text-center space-y-6">
        {/* Animated Book Spinner */}
        <div className="flex justify-center gap-2 h-[60px] mx-auto">
          {['bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'].map((color, index) => (
            <div
              key={index}
              className={`w-4 h-[50px] ${color} rounded-sm animate-[bounce_1.2s_infinite_ease-in-out]`}
              style={{
                transformOrigin: 'bottom',
                animationDelay: `${index * -0.2 + 0.4}s`
              }}
            />
          ))}
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Loading Your Library</h2>
          <p className="text-gray-600">Fetching the latest books for you</p>
        </div>
        
        {/* Dot Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
}