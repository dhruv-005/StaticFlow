"""
Voice-to-API Natural Language Processor
Refines spoken transcripts into clean architectural directives.
"""

from loguru import logger
from app.services.ai.provider_router import ai_router


class VoiceProcessorService:
    SYSTEM_PROMPT = """You are StaticFlow's Speech-to-API Assistant.
Clean up natural speech transcripts into clear, concise API specifications.
Remove filler words, correct technical terms (e.g. 'sequel' -> 'SQL', 'post-grass' -> 'PostgreSQL'),
and structure requirements into entities, routes, and authentication rules."""

    async def process_voice_transcript(self, raw_transcript: str) -> str:
        prompt = f"Clean and refine this spoken API requirement into a structured prompt:\n\n\"{raw_transcript}\""
        logger.info("🎙️ Processing voice prompt transcript...")

        result = await ai_router.query(prompt, self.SYSTEM_PROMPT)
        return result["content"]


voice_processor = VoiceProcessorService()
