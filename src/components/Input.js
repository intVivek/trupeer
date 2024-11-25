export default function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      <label
        className="block text-slate-100 text-sm font-medium mb-1"
        htmlFor="startTime"
      >
        {label}
      </label>
      <input
        type="number"
        step="any"
        className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
        {...props}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
