from __future__ import annotations

import server
import v2
from retrieval_v3 import retrieve_evidence_v3

# answer_question_v2 resolves retrieve_evidence through the v2 module globals.
v2.retrieve_evidence = retrieve_evidence_v3
# /api/rag/v2/search imported the old function directly in server.py.
server.retrieve_evidence = retrieve_evidence_v3

if __name__ == "__main__":
    raise SystemExit(server.main())
