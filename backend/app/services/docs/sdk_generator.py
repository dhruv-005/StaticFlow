"""
Type-Safe SDK Client Code Generator
"""

class SdkGeneratorService:
    def generate_typescript_client(self, api_name: str, endpoints: list[dict]) -> str:
        return f"""// Auto-generated TypeScript Client for {api_name}
export class {api_name.replace(' ', '')}Client {{
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = 'https://api.staticflow.dev', token?: string) {{
    this.baseUrl = baseUrl;
    this.token = token;
  }}

  async getHealth() {{
    const res = await fetch(`\${this.baseUrl}/health`);
    return res.json();
  }}
}}
"""


sdk_generator = SdkGeneratorService()
