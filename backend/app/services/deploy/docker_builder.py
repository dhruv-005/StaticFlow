"""
Docker Container Image Builder
"""

import subprocess
from loguru import logger


class DockerBuilderService:
    def build_and_tag(self, tag: str, dockerfile_path: str = "Dockerfile", context: str = ".") -> bool:
        logger.info(f"🐳 Building container image: {tag}")
        try:
            res = subprocess.run(
                ["docker", "build", "-f", dockerfile_path, "-t", tag, context],
                capture_output=True,
                text=True,
                timeout=180,
            )
            return res.returncode == 0
        except Exception as e:
            logger.error(f"Docker build failed: {e}")
            return False


docker_builder = DockerBuilderService()
