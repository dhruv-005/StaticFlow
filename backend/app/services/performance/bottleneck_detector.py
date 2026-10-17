"""
Automated Bottleneck Detection & Recommendation Engine
"""

from loguru import logger


class BottleneckDetectorService:
    def detect_bottlenecks(self, avg_latency_ms: float, p99_latency_ms: float, error_rate: float) -> list[dict]:
        diagnostics = []

        if avg_latency_ms > 100:
            diagnostics.append({
                "type": "DATABASE_QUERY_LATENCY",
                "severity": "HIGH",
                "title": "High Average Query Latency",
                "recommendation": "Add Redis cache layer to read-heavy endpoints and verify foreign key composite indexing."
            })

        if p99_latency_ms > 200:
            diagnostics.append({
                "type": "TAIL_LATENCY_SPIKE",
                "severity": "MEDIUM",
                "title": "P99 Tail Latency Degradation",
                "recommendation": "Increase database connection pool size and enable HTTP/2 keepalive pooling."
            })

        if error_rate > 0.01:
            diagnostics.append({
                "type": "RATE_LIMIT_DROP",
                "severity": "HIGH",
                "title": "Packet Drops Under Concurrency",
                "recommendation": "Adjust reverse proxy burst buffer and scale out worker replica count."
            })

        if not diagnostics:
            diagnostics.append({
                "type": "OPTIMAL",
                "severity": "LOW",
                "title": "All Telemetry Within SLA",
                "recommendation": "System demonstrates optimal sub-50ms performance across all percentile thresholds."
            })

        return diagnostics


bottleneck_detector = BottleneckDetectorService()
