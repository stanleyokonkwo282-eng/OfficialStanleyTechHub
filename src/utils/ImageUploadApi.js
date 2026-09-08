async function handleUpload(imageFile) {
  if (!imageFile) {
    throw new Error("No image file provided.");
  }

  if (!import.meta.env.VITE_BASE_URL) {
    throw new Error("VITE_BASE_URL is not configured. Set the backend API URL first.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  let res;
  try {
    res = await fetch(`${import.meta.env.VITE_BASE_URL}/get-ik-signature`, {
      method: "GET",
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(
      `Image upload service is unavailable. Check the backend and VITE_BASE_URL. ${error?.message || ""}`.trim()
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const rawDetail = await res.text().catch(() => "");
    let detail = rawDetail || res.statusText || "Check the backend /get-ik-signature route.";

    try {
      const parsed = JSON.parse(rawDetail);
      if (parsed?.message) {
        detail = parsed.message;
      }
    } catch {
      // raw response is not JSON, so keep the plain text error message
    }

    if (/ImageKit Id.*API Key.*API secret|ImageKit .*necessary for initialization/i.test(detail)) {
      throw new Error(
        "Image upload signature request failed because the backend ImageKit credentials are missing or incomplete. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in the Render backend environment, then redeploy."
      );
    }

    throw new Error(`Image upload signature request failed (${res.status}). ${detail}`);
  }

  const payload = await res.json();
  const { signature, expire, token, publicKey } = payload || {};

  if (!signature || !expire || !token) {
    throw new Error("Invalid ImageKit signature response. The backend did not return a valid upload token.");
  }

  const ikPublicKey =
    publicKey || import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  if (!ikPublicKey) {
    throw new Error(
      "ImageKit public key is missing. Set VITE_IMAGEKIT_PUBLIC_KEY in the frontend environment or have the backend return { publicKey } in /get-ik-signature."
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
    throw new Error(
      `Image upload failed (${uploadRes.status}). ${detail || uploadRes.statusText || "Check your ImageKit credentials and file."}`
    );
  }

  const uploadData = await uploadRes.json();
  return uploadData.url;
}

export default handleUpload;
