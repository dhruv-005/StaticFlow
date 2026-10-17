"""
Interactive Sandbox Playground Request Builder
"""

class PlaygroundBuilderService:
    def format_curl_command(self, method: str, url: str, headers: dict | None = None, body: dict | None = None) -> str:
        cmd = f"curl -X {method} '{url}'"
        if headers:
            for k, v in headers.items():
                cmd += f" -H '{k}: {v}'"
        if body and method in ["POST", "PUT", "PATCH"]:
            import json
            cmd += f" -d '{json.dumps(body)}'"
        return cmd


playground_builder = PlaygroundBuilderService()
