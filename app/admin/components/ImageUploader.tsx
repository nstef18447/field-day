"use client";

import { useState } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onChange([...images, url]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="admin-image-uploader">
      <div className="admin-image-grid">
        {images.map((url, i) => (
          <div key={i} className="admin-image-thumb">
            <img src={url} alt={`Product ${i + 1}`} />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="admin-image-remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="admin-image-upload-btn">
        {uploading ? "Uploading..." : "+ Add Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          hidden
        />
      </label>
    </div>
  );
}
