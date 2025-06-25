type DisplayIMGProps = {
  previewURL: string | null;
};

export default function DisplayIMG({ previewURL }: DisplayIMGProps) {
  if (!previewURL) return;
  return (
    <img
      src={previewURL}
      alt="Preview"
      className="mx-auto h-110 w-80 rounded shadow"
    />
  );
}
