import { auth } from '../firebase';

/**
 * Submit audit report to backend API
 * @param {Object} payload - { meta, fields, riskScore, photos }
 * @returns {Promise<{ auditId: string, syncedAt: string }>}
 */
export async function sendReport({ meta, fields, riskScore, photos }) {
  // Check online status
  if (!navigator.onLine) {
    throw new Error('offline');
  }

  // Get Firebase ID token
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const token = await user.getIdToken();

  // Prepare photos array: flatten { sectionId: [...photos] } into array of { sectionId, name, data }
  const photosArray = Object.entries(photos || {}).flatMap(([sectionId, list]) =>
    (Array.isArray(list) ? list : []).map(p => ({ sectionId, name: p.name, data: p.data }))
  );

  const apiUrl = process.env.REACT_APP_AUDIT_API_URL;
  if (!apiUrl) {
    throw new Error('Audit API URL not configured');
  }

  const res = await fetch(`${apiUrl}/api/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meta, fields, riskScore, photos: photosArray }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error (${res.status})`);
  }

  return res.json(); // { auditId, syncedAt }
}

/**
 * Retry a previously failed submission
 * @param {Object} queuedItem - { formData, photos, riskScore, timestamp }
 * @returns {Promise<{ auditId: string, syncedAt: string }>}
 */
export async function retrySubmission(queuedItem) {
  return sendReport({
    meta: queuedItem.formData.meta,
    fields: queuedItem.formData.fields,
    riskScore: queuedItem.riskScore,
    photos: queuedItem.photos,
  });
}
