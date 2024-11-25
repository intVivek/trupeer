import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";

const Button = ({ children, label, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 outline-none ${className}`}
      {...props}
    >
      {children || label}
    </button>
  );
};

export default function BlockEditor({
  index,
  zoomBlocks,
  setZoomBlocks,
  onClose,
  duration,
}) {
  const editingBlock = zoomBlocks[index];

  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  useEffect(() => {
    if (editingBlock) {
      setValue("startTime", editingBlock.startTime);
      setValue("endTime", editingBlock.endTime);
      setValue("x", editingBlock.x);
      setValue("y", editingBlock.y);
      setValue("scaleFactor", editingBlock.scaleFactor);
    }
  }, [editingBlock, setValue]);

  const handleDelete = () => {
    setZoomBlocks((p) => p.filter((_, i) => i !== index));
    onClose();
  };

  const onSubmit = (data) => {
    const { startTime, endTime, x, y, scaleFactor } = data;

    if(scaleFactor<600/(600 - x)){
      return setError(`Zoom box getting out of video, Either reduce X coordinate or make scale factor greate than ${600/(600 - x)}`)
    }

    if(scaleFactor<320/(320 - y)){
      return setError(`Zoom box getting out of video, Either reduce Y coordinate or make scale factor greate than ${600/(600 - y)}`)
    }

    const updatedBlock = {
      id: editingBlock.id,
      startTime,
      endTime,
      x: x,
      y: y,
      scaleFactor,
    };

    setZoomBlocks((prev) =>
      prev.map((block) => (block.id === editingBlock.id ? updatedBlock : block))
    );
    onClose();
  };

  return (
    <div className="fixed w-screen h-screen">
      <div className="bg-backdrop w-screen h-screen"></div>
      <div className="absolute bg-gray900 flex flex-col px-4 right-0 h-screen top-0 w-[400px] border-l border-gray-800 z-30 animate-slide-in">
        <div className="flex justify-between items-center my-8 text-slate-100 text-xl font-medium">
          Edit Zoom Block
          <RxCross1 className="ml-auto cursor-pointer" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-slate-100 text-sm font-medium mb-1"
              htmlFor="startTime"
            >
              Start Time
            </label>
            <input
              id="startTime"
              {...register("startTime", {
                required: "Start time is required",
                min: {
                  value: zoomBlocks[index - 1]?.endTime || 0,
                  message: `Overlaping with another zoom block, value should be greater than ${
                    zoomBlocks[index - 1]?.endTime - 1 || 0
                  }`,
                },
                max: {
                  value: editingBlock?.endTime - 1,
                  message: `Start time must be less than end time`,
                },
              })}
              type="number"
              step="any"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.startTime && (
              <div className="text-red-500 text-sm">
                {errors.startTime.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-100 text-sm font-medium mb-1"
              htmlFor="endTime"
            >
              End Time
            </label>
            <input
              id="endTime"
              {...register("endTime", {
                required: "End time is required",
                min: {
                  value: editingBlock?.startTime + 1,
                  message: "End time must be greater than start time",
                },
                max: {
                  value: zoomBlocks[index + 1]?.startTime || duration,
                  message: `Overlaping with another zoom block, value should be less than ${
                    zoomBlocks[index + 1]?.startTime + 1 || duration
                  }`,
                },
              })}
              type="number"
              step="any"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.endTime && (
              <div className="text-red-500 text-sm">
                {errors.endTime.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-100 text-sm font-medium mb-1"
              htmlFor="x"
            >
              X Coordinate
            </label>
            <input
              id="x"
              {...register("x", {
                required: "X coordinate is required",
                min: {
                  value: 0,
                  message: "Minimum value should be zero",
                },
                max: {
                  value: 600,
                  message: `Maximum value should be 600`,
                },
              })}
              type="number"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.x && (
              <div className="text-red-500 text-sm">{errors.x.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-100 text-sm font-medium mb-1"
              htmlFor="y"
            >
              Y Coordinate
            </label>
            <input
              id="y"
              {...register("y", {
                required: "Y coordinate is required",
                min: {
                  value: 0,
                  message: "Minimum value should be zero",
                },
                max: {
                  value: 320,
                  message: `Maximum value should be 320`,
                },
              })}
              type="number"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.y && (
              <div className="text-red-500 text-sm">{errors.y.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-100 text-sm font-medium mb-1"
              htmlFor="scaleFactor"
            >
              Scale Factor
            </label>
            <input
              id="scaleFactor"
              step={'any'}
              {...register("scaleFactor", {
                required: "Scale Factor is required",
                min: {
                  value: 1,
                  message: "Minimum value should be 1",
                },
              })}
              type="number"
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.scaleFactor && (
              <div className="text-red-500 text-sm">
                {errors.scaleFactor.message}
              </div>
            )}
          </div>

          {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

          <div className="flex justify-between mt-auto mb-4">
            <Button onClick={handleDelete} label="Delete" />
            <Button type="submit" label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
}
