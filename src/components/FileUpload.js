import { RiFileUploadLine } from "react-icons/ri";

export default function FileUpload({ label = 'Select a video', file, onChange }) {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onChange(file, event);
  };

  return (
    <div className="flex mb-4 flex-col items-center text-white">
      {!file && <h1 className="mb-4 text-lg">{label}</h1>}

      <label
        htmlFor="file-upload"
        className="bg-accentColor hover:bg-accentColorDark text-white px-4 py-2 rounded-md cursor-pointer flex items-center space-x-2"
      >
        <RiFileUploadLine className="text-2xl" />
        <span>{file?"Upload another Video":"Upload a Video"}</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
