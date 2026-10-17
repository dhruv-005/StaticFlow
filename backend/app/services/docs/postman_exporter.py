"""
Postman v2.1 Collection Exporter
"""

import json


class PostmanExporterService:
    def export_collection(self, collection_name: str, endpoints: list[dict]) -> str:
        items = []
        for ep in endpoints:
            items.append({
                "name": ep.get("summary", ep.get("path", "")),
                "request": {
                    "method": ep.get("method", "GET"),
                    "url": {
                        "raw": f"https://api.staticflow.dev{ep.get('path', '')}",
                        "host": ["api", "staticflow", "dev"],
                        "path": [p for p in ep.get("path", "").split("/") if p],
                    },
                },
            })

        collection = {
            "info": {
                "name": collection_name,
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
            },
            "item": items,
        }
        return json.dumps(collection, indent=2)


postman_exporter = PostmanExporterService()
