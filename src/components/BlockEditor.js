import { useVideoContext } from "@/hooks/useVideoContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import Button from "./Button";
import Input from "./Input";

export default function BlockEditor({ id, onClose }) {
  const { setZoomBlocks, zoomBlocks, duration, dispatch } = useVideoContext();

  const index = zoomBlocks.findIndex(obj => obj.id === id );



  const editingBlock = zoomBlocks[index];

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
    dispatch(setZoomBlocks(zoomBlocks.filter((_, i) => i !== index)));
    onClose();
  };

  const onSubmit = (data) => {
    const { startTime, endTime, x, y, scaleFactor } = data;

    if (scaleFactor < 600 / (600 - x)) {
      return setError(
        `Zoom box getting out of video, Either reduce X coordinate or make scale factor greate than ${
          600 / (600 - x)
        }`
      );
    }

    if (scaleFactor < 320 / (320 - y)) {
      return setError(
        `Zoom box getting out of video, Either reduce Y coordinate or make scale factor greate than ${
          600 / (600 - y)
        }`
      );
    }

    const updatedBlock = {
      id: editingBlock.id,
      startTime,
      endTime,
      x: x,
      y: y,
      scaleFactor,
    };

    dispatch(setZoomBlocks(
      zoomBlocks.map((block) => (block.id === editingBlock.id ? updatedBlock : block))
    ));
    onClose();
  };

  return (
    <div className="fixed w-screen h-screen">
      <div className="bg-backdrop w-screen h-screen"></div>
      <div className="absolute bg-gray900 flex flex-col px-4 right-0 h-screen top-0 w-[400px] border-l border-gray200 z-30 animate-slide-in">
        <div className="flex justify-between items-center my-8 text-slate-100 text-xl font-medium">
          Edit Zoom Block
          <RxCross1 className="ml-auto cursor-pointer" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={"Start Time"}
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
            error={errors?.startTime?.message}
          />

          <Input
            label={"End Time"}
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
            error={errors?.endTime?.message}
          />

          <Input
            label={"X Coordinate"}
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
            error={errors?.x?.message}
          />

          <Input
            label={"Y Coordinate"}
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
            error={errors?.y?.message}
          />

          <Input
            label={"Scale Factor"}
            id="scaleFactor"
            step={"any"}
            {...register("scaleFactor", {
              required: "Scale Factor is required",
              min: {
                value: 1,
                message: "Minimum value should be 1",
              },
            })}
            error={errors?.scaleFactor?.message}
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-4 mt-auto mb-4">
            <Button secondary onClick={handleDelete} label="Delete" />
            <Button type="submit" label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
}
