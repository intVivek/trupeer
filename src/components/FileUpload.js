export default function FileUpload({ label, onChange }) {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onChange(file, event)
  };

  return (
    <div>
      <h1>{label}</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
}
