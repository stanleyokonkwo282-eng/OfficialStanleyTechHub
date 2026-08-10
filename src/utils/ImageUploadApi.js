async function handleUpload(imageFile) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/get-ik-signature`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Signature fetch failed: ${res.status}`);
    }

    const { signature, expire, token } = await res.json();

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("fileName", imageFile.name || Date.now().toString());
    formData.append("folder", "creators-hub-academy");
    formData.append("signature", signature);
    formData.append("token", token);
    formData.append("expire", expire);
    formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }

    const uploadData = await uploadRes.json();
    return uploadData.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

export default handleUpload;
