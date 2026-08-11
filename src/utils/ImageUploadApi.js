import { auth } from "../../firebase.config";

async function getHeader() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    console.error("Failed to get ID token for upload:", err);
  }
  return {};
}

async function handleUpload(imageFile) {
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const headers = await getHeader();

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/get-ik-signature`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ fileName: imageFile.name }),
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
      "ImageKit public key is missing. Set VITE_IMAGEKIT_PUBLIC_KEY in your environment, " +
        "or have /get-ik-signature return { publicKey }."
    );
  }

  const form = new FormData();
  form.append("file", imageFile);
  form.append("fileName", imageFile.name || Date.now().toString());
  form.append("folder", "creators-hub-academy");
  form.append("signature", signature);
  form.append("token", token);
  form.append("expire", expire);
  form.append("publicKey", ikPublicKey);

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    const detail = await uploadRes.text().catch(() => "");
    throw new Error(`Upload failed (${uploadRes.status}): ${detail || uploadRes.statusText}`);
  }

  const uploadData = await uploadRes.json();
  return uploadData.url;
}

export default handleUpload;
