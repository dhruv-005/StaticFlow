# StaticFlow Autonomous Security Engine Container
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PATH="/root/go/bin:/usr/local/go/bin:${PATH}"

WORKDIR /engine

# Install system dependencies, security scanners, and runtime tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    wget \
    git \
    python3 \
    python3-pip \
    python3-venv \
    golang-go \
    openjdk-17-jre-headless \
    sqlmap \
    nikto \
    jq \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Semgrep, Bandit, and Python security tools in a virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir \
    semgrep \
    bandit \
    requests \
    pyyaml \
    rich

# Install ProjectDiscovery Nuclei (latest)
RUN go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Install Trivy for filesystem & dependency scanning
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Create scanning directories
RUN mkdir -p /engine/scanners /engine/payloads /engine/reports /engine/configs

COPY scanners/ /engine/scanners/
COPY payloads/ /engine/payloads/
COPY configs/ /engine/configs/

RUN chmod +x /engine/scanners/*.sh

VOLUME ["/engine/reports", "/target"]

ENTRYPOINT ["/bin/bash"]
CMD ["/engine/scanners/owasp-zap.sh"]
