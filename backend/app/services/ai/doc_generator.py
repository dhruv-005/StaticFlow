class DocGeneratorService:
    async def generate_openapi_spec(self, code_files: dict[str, str]) -> str:
        return """openapi: 3.1.0
info:
  title: StaticFlow Generated API
  version: 1.0.0
paths:
  /api/v1/health:
    get:
      responses:
        '200':
          description: OK
"""

doc_generator = DocGeneratorService()
