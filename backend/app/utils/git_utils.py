import subprocess
from loguru import logger


def init_git_repo(repo_dir: str) -> bool:
    try:
        subprocess.run(["git", "init"], cwd=repo_dir, capture_output=True, check=True)
        return True
    except Exception as e:
        logger.error(f"Git init error: {e}")
        return False


def create_git_commit(repo_dir: str, message: str) -> bool:
    try:
        subprocess.run(["git", "add", "."], cwd=repo_dir, capture_output=True, check=True)
        subprocess.run(["git", "commit", "-m", message], cwd=repo_dir, capture_output=True, check=True)
        return True
    except Exception as e:
        logger.error(f"Git commit error: {e}")
        return False


def get_latest_commit_hash(repo_dir: str = ".") -> str:
    try:
        res = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=repo_dir,
            capture_output=True,
            text=True,
            check=True,
        )
        return res.stdout.strip()
    except Exception:
        return "head-init"
