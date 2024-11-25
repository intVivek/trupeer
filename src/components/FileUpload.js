export default function FileUpload({ label='Select a video', onChange }) {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onChange(file, event)
  };

  return (
    <div>
      <h1 className="text-white mb-4">{label}</h1>
      <input
      className="text-white"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
}
