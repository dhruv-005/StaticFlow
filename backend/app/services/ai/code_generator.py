from app.schemas.generate import GenerateResponse, CodeBlock

class CodeGeneratorService:
    async def generate(self, prompt: str, language: str = "node-express", database: str = "postgresql", include_auth: bool = True, include_docker: bool = True) -> GenerateResponse:
        return GenerateResponse(
            success=True,
            summary=f"Scaffolded API for: {prompt}",
            codeBlocks=[
                CodeBlock(fileName="src/index.ts", language="typescript", code="// Express Server"),
                CodeBlock(fileName="prisma/schema.prisma", language="prisma", code="// Prisma schema"),
            ],
            providerUsed="ollama-local",
            generationTimeMs=250.0
        )

code_generator = CodeGeneratorService()
