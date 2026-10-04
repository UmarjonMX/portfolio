// Canonical CV asset — served from /public and copied verbatim into the build output.
export const CV_PATH = '/UmarjonMX_CV.pdf';
export const CV_FILENAME = 'UmarjonMX_CV.pdf';

/**
 * Verifies the CV is reachable, then triggers a real download of the PDF.
 * Resolves to true on success, false if the file is missing/unreachable.
 */
export async function downloadCV({ delay = 700 } = {}) {
  try {
    const res = await fetch(CV_PATH, { method: 'HEAD' });
    if (!res.ok) return false;
  } catch {
    return false;
  }

  if (delay > 0) await new Promise((r) => setTimeout(r, delay));

  const link = document.createElement('a');
  link.href = CV_PATH;
  link.download = CV_FILENAME;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}