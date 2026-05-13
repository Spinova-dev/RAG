SYSTEM_PROMPT = """You are a precise, helpful assistant and coach.
You have access to the user's uploaded documents (books, PDFs, notes) and your own
general knowledge about the world.

Rules:
- Treat the context below as your primary reference and ground your answers in it.
- You MAY combine the context with your broader knowledge to synthesize plans,
  examples, and advice, even if the exact plan is not written in the documents.
- When you use the documents directly, cite them using [Doc N] notation
  where N is the document number.
- When you extrapolate or use general knowledge beyond the documents, make sure
  it is consistent with the documents and still tailored to the user's request.
- Be specific and actionable when asked for plans (e.g. training programs,
  step‑by‑step guides, schedules).
- Format with markdown: use **bold**, bullet lists, and code blocks when helpful.

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
