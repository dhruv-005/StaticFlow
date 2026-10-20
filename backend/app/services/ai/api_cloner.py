"""
AI API Cloner Service
Scrapes or parses public API documentation URLs and generates full backend implementations with improvements.
"""

import httpx
from bs4 import BeautifulSoup
from loguru import logger
from app.services.ai.provider_router import ai_router


class ApiClonerService:
    SYSTEM_PROMPT = """You are StaticFlow's API Cloner.
Analyze public API documentation text and generate a complete, working backend implementation.
Include all endpoints, input validation, models, and security middleware."""

    async def clone_from_url(self, doc_url: str, target_language: str = "node-express") -> dict:
        logger.info(f"🧬 Cloning API structure from: {doc_url}")
        
        extracted_text = ""
        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                resp = await client.get(doc_url)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    # Extract headings, code blocks, and paragraphs
                    elements = soup.find_all(["h1", "h2", "h3", "code", "pre", "p"])
                    extracted_text = "\n".join([e.get_text() for e in elements[:60]])
        except Exception as e:
            logger.warning(f"Failed to scrape URL {doc_url}: {e}. Proceeding with URL name inference.")
            extracted_text = f"API Documentation from {doc_url}"

        prompt = f"Clone this API specification in {target_language}. Generate all routes, schemas, and controllers:\n\n{extracted_text[:3000]}"
        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)

        return {
            "clonedCode": result["content"],
            "sourceUrl": doc_url,
            "provider": result["provider"],
        }


api_cloner = ApiClonerService()
