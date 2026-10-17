from app.schemas.generate import IntentResponse

class IntentParserService:
    async def parse_intent(self, prompt: str) -> IntentResponse:
        return IntentResponse(
            entities=["User", "Item"],
            features=["Auth", "CRUD"],
            suggestedStack={"language": "node-express", "database": "postgresql"},
            endpoints=["GET /api/v1/items", "POST /api/v1/items"],
            complexity="medium",
            clarifyingQuestions=["Include rate limiting?"]
        )

intent_parser = IntentParserService()
