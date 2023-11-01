//https://codeconcisely.com/posts/nextjs-app-router-api-download-file/

"use client";

export default function DownloadComponent() {
  const handleClick = async () => {
    const response = await fetch("/api/file");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main>
      <button type="button" onClick={handleClick}>
        Download
      </button>
    </main>
  );
}
