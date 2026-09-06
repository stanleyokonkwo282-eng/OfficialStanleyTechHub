async function uploadPdf(pdfFile) {
  if (!pdfFile) {
    throw new Error("No PDF file provided");
  }

  if (pdfFile.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/upload/pdf`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`PDF upload failed (${res.status}): ${detail || res.statusText}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "PDF upload failed");
  }

  return data;
}

async function getOptimizedPdfUrl(pdfUrl) {
  if (!pdfUrl) return null;

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/optimize-pdf-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: pdfUrl }),
  });

  if (!res.ok) {
    return pdfUrl;
  }

  const data = await res.json();
  return data.success ? data.optimizedUrl : pdfUrl;
}

export { uploadPdf, getOptimizedPdfUrl };
export default { uploadPdf, getOptimizedPdfUrl };
