/**
 * Storage for student-recorded Quick Tips clips.
 *
 * These videos are device-local only — there is no backend, so "uploading" a
 * clip means saving it in this browser's IndexedDB (localStorage is far too
 * small for video). A clip is only ever visible to the profile that added it,
 * on this one device/browser; it is never sent anywhere and no other student
 * — even on the same device — can see it. See src/pages/QuickTips.tsx.
 */

export interface StudentClip {
  id: string
  profileId: string
  caption: string
  createdAt: number
  type: string
  size: number
}

interface StoredClip extends StudentClip {
  blob: Blob
}

const DB_NAME = 'future-makers-academy-clips'
const STORE = 'clips'
const DB_VERSION = 1

/** Keep clips genuinely "quick" and keep a shared device's storage in check. */
export const MAX_CLIP_BYTES = 80 * 1024 * 1024 // ~80MB
export const MAX_CLIPS_PER_PROFILE = 30

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support saving video locally.'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('profileId', 'profileId')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('Could not open local video storage.'))
  })
}

function makeId(): string {
  return `clip_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

function stripBlob(rec: StoredClip): StudentClip {
  const { blob: _blob, ...meta } = rec
  return meta
}

export async function listClips(profileId: string): Promise<StudentClip[]> {
  const db = await openDb()
  try {
    const rows = await new Promise<StoredClip[]>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const idx = tx.objectStore(STORE).index('profileId')
      const req = idx.getAll(IDBKeyRange.only(profileId))
      req.onsuccess = () => resolve(req.result as StoredClip[])
      req.onerror = () => reject(req.error ?? new Error('Could not read local clips.'))
    })
    return rows.map(stripBlob).sort((a, b) => b.createdAt - a.createdAt)
  } finally {
    db.close()
  }
}

export async function addClip(
  profileId: string,
  file: File,
  caption: string,
): Promise<StudentClip> {
  if (!file.type.startsWith('video/')) {
    throw new Error('That file doesn’t look like a video.')
  }
  if (file.size > MAX_CLIP_BYTES) {
    throw new Error(
      `That video is ${Math.round(file.size / 1e6)}MB — keep clips under ${Math.round(MAX_CLIP_BYTES / 1e6)}MB (about 1-2 minutes).`,
    )
  }
  const existing = await listClips(profileId)
  if (existing.length >= MAX_CLIPS_PER_PROFILE) {
    throw new Error(
      `You've saved ${MAX_CLIPS_PER_PROFILE} clips on this device already — delete an old one before adding another.`,
    )
  }

  const record: StoredClip = {
    id: makeId(),
    profileId,
    caption: caption.trim().slice(0, 200),
    createdAt: Date.now(),
    type: file.type,
    size: file.size,
    blob: file,
  }

  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(record)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Could not save the clip.'))
    })
  } finally {
    db.close()
  }
  return stripBlob(record)
}

export async function getClipBlob(id: string): Promise<Blob | null> {
  const db = await openDb()
  try {
    const rec = await new Promise<StoredClip | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () => resolve(req.result as StoredClip | undefined)
      req.onerror = () => reject(req.error ?? new Error('Could not load the clip.'))
    })
    return rec?.blob ?? null
  } finally {
    db.close()
  }
}

export async function deleteClip(id: string): Promise<void> {
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Could not delete the clip.'))
    })
  } finally {
    db.close()
  }
}

/** Remove every clip belonging to a profile — called when a profile is deleted. */
export async function deleteAllClipsFor(profileId: string): Promise<void> {
  const clips = await listClips(profileId)
  await Promise.all(clips.map((c) => deleteClip(c.id)))
}
