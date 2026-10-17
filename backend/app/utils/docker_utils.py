import subprocess
from loguru import logger


def check_docker_daemon() -> bool:
    try:
        res = subprocess.run(["docker", "info"], capture_output=True, text=True, timeout=5)
        return res.returncode == 0
    except Exception:
        return False


def build_image(dockerfile_path: str, tag: str, context_dir: str = ".") -> bool:
    try:
        logger.info(f"🐳 Building Docker image: {tag} from {dockerfile_path}")
        res = subprocess.run(
            ["docker", "build", "-f", dockerfile_path, "-t", tag, context_dir],
            capture_output=True,
            text=True,
            timeout=300,
        )
        return res.returncode == 0
    except Exception as e:
        logger.error(f"Docker build error: {e}")
        return False


def remove_container(container_name: str, force: bool = True) -> bool:
    try:
        cmd = ["docker", "rm", "-f", container_name] if force else ["docker", "rm", container_name]
        subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        return True
    except Exception:
        return False
