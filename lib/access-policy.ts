export type Identity = 'Alice' | 'Bob' | 'Admin' | 'Anonymous'
export type DocumentId = 'doc-101' | 'doc-202' | 'doc-missing'
export type AppMode = 'vulnerable' | 'repaired'

export const documents = {
  'doc-101': { owner: 'Alice', title: 'Q4 Board Strategy', content: 'Confidential strategy brief — FY2025 operating plan.' },
  'doc-202': { owner: 'Bob', title: 'Customer Research Notes', content: 'Private customer research notes and interview summaries.' },
} as const

export type AuthorizationResult = {
  status: 200 | 401 | 403 | 404
  decision: 'Allowed' | 'Denied'
  reason: string
  content?: string
  contentLeaked: boolean
}

export function authorize(identity: Identity, documentId: DocumentId, mode: AppMode): AuthorizationResult {
  const document = documents[documentId as keyof typeof documents]
  if (!document) return { status: 404, decision: 'Denied', reason: 'The requested document does not exist.', contentLeaked: false }
  if (identity === 'Anonymous') return { status: 401, decision: 'Denied', reason: 'Authentication is required to access documents.', contentLeaked: false }
  if (mode === 'vulnerable') return { status: 200, decision: 'Allowed', reason: 'Authenticated session accepted without an ownership check.', content: document.content, contentLeaked: identity !== document.owner && identity !== 'Admin' }
  if (identity === document.owner || identity === 'Admin') return { status: 200, decision: 'Allowed', reason: identity === 'Admin' ? 'Administrator access granted.' : 'Document owner access granted.', content: document.content, contentLeaked: false }
  return { status: 403, decision: 'Denied', reason: 'You do not own this document and are not an administrator.', contentLeaked: false }
}

export const testCases = [
  { id: 'owner-a', name: 'Alice requests doc-101', identity: 'Alice' as Identity, documentId: 'doc-101' as DocumentId, expectedRepaired: 200 as const, expectedVulnerable: 200 as const },
  { id: 'owner-b', name: 'Bob requests doc-202', identity: 'Bob' as Identity, documentId: 'doc-202' as DocumentId, expectedRepaired: 200 as const, expectedVulnerable: 200 as const },
  { id: 'cross-owner', name: 'Bob requests doc-101', identity: 'Bob' as Identity, documentId: 'doc-101' as DocumentId, expectedRepaired: 403 as const, expectedVulnerable: 403 as const },
  { id: 'admin', name: 'Admin requests doc-101', identity: 'Admin' as Identity, documentId: 'doc-101' as DocumentId, expectedRepaired: 200 as const, expectedVulnerable: 200 as const },
  { id: 'anonymous', name: 'Anonymous requests doc-101', identity: 'Anonymous' as Identity, documentId: 'doc-101' as DocumentId, expectedRepaired: 401 as const, expectedVulnerable: 401 as const },
  { id: 'missing', name: 'Alice requests a missing document', identity: 'Alice' as Identity, documentId: 'doc-missing' as DocumentId, expectedRepaired: 404 as const, expectedVulnerable: 404 as const },
]

export type TestResult = ReturnType<typeof runTest>
export function runTest(test: typeof testCases[number], mode: AppMode) {
  const result = authorize(test.identity, test.documentId, mode)
  const expected = test.id === 'cross-owner' ? (mode === 'repaired' ? 403 : 200) : (mode === 'repaired' ? test.expectedRepaired : test.expectedVulnerable)
  return { ...test, ...result, expected, passed: result.status === expected && !(test.id === 'cross-owner' && mode === 'vulnerable' && result.contentLeaked) }
}

export const codeBefore = `if (session.user) {\n  return document\n}`
export const codeAfter = `if (!session.user) return 401\n\nconst isOwner = document.ownerId === session.user.id\nconst isAdmin = session.user.role === "admin"\n\nif (!isOwner && !isAdmin) return 403\nreturn document`
