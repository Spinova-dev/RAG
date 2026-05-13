from dataclasses import dataclass

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings


@dataclass
class TextChunk:
    content: str
    chunk_index: int
    page_number: int
    metadata: dict


def chunk_document(parsed_doc, document_id: str) -> list[TextChunk]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""],
        length_function=len,
    )
    chunks: list[TextChunk] = []
    chunk_idx = 0
    for page_num, page_text in parsed_doc.page_map.items():
        if not page_text.strip():
            continue
        splits = splitter.split_text(page_text)
        for split in splits:
            if len(split.strip()) < 50:
                continue
            chunks.append(
                TextChunk(
                    content=split.strip(),
                    chunk_index=chunk_idx,
                    page_number=page_num,
                    metadata={**parsed_doc.metadata, "document_id": document_id},
                )
            )
            chunk_idx += 1
    return chunks

