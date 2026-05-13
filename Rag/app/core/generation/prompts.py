SYSTEM_PROMPT = """You are a precise, helpful assistant answering questions
based ONLY on the provided context documents.

Rules:
- Answer using ONLY information from the context below
- If the context doesn't contain the answer, say: 'I couldn't find that in the
  uploaded documents. Try uploading more relevant files.'
- Always cite sources using [Doc N] notation where N is the document number
- Be concise but complete — avoid padding
- Format with markdown: use **bold**, bullet lists, and code blocks when helpful

Context documents:
{context}

Previous conversation:
{history}"""


def build_context(chunks: list) -> str:
    parts: list[str] = []
    for i, chunk in enumerate(chunks, 1):
        parts.append(
            f"[Doc {i}] (page {chunk.page_number}, similarity: {chunk.similarity:.0%})\n{chunk.content}"
        )
    return "\n\n---\n\n".join(parts)


def build_history(messages: list[dict]) -> str:
    if not messages:
        return "No previous messages."
    lines: list[str] = []
    for msg in messages[-6:]:
        lines.append(f"{msg['role'].upper()}: {msg['content'][:500]}")
    return "\n".join(lines)

