async function handleUpload(imageFile) {
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/get-ik-signature`, {
    method: "GET",
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Signature request failed (${res.status}): ${detail || res.statusText}`
    );
  }

  const { signature, expire, token, publicKey } = await res.json();

  const ikPublicKey =
    publicKey || import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  if (!ikPublicKey) {
    throw new Error(
      "ImageKit public key is missing. Have the backend return { publicKey } in /get-ik-signature, " +
        "or set VITE_IMAGEKIT_PUBLIC_KEY in the frontend environment."
    );
  }

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("fileName", imageFile.name || Date.now().toString());
  formData.append("folder", "creators-hub-academy");
  formData.append("signature", signature);
  formData.append("token", token);
  formData.append("expire", expire);
  formData.append("publicKey", ikPublicKey);

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const detail = await uploadRes.text().catch(() => "");
    throw new Error(`Upload failed (${uploadRes.status}): ${detail || uploadRes.statusText}`);
  }

  const uploadData = await uploadRes.json();
  return uploadData.url;
}

export default handleUpload;
