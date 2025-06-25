type DisplayPDFProps = {
  previewURL: string | null;
};

export default function DisplayPDF({ previewURL }: DisplayPDFProps) {
  if (!previewURL) return;
  return (
    <embed
      src={previewURL}
      type="application/pdf"
      className="h-[450px] w-full rounded shadow"
    />
  );
}
