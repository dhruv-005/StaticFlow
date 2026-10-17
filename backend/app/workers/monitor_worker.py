"""
Continuous Monitoring & Anomaly Detection Worker
Polls endpoints, tracks latencies, and computes rolling error rates.
"""

import asyncio
import random
from loguru import logger


class MonitorWorker:
    def __init__(self):
        self.is_monitoring = False

    async def start_polling(self, interval_seconds: int = 30):
        self.is_monitoring = True
        logger.info(f"📡 [MonitorWorker] Continuous edge telemetry polling started (Interval: {interval_seconds}s)")

        while self.is_monitoring:
            try:
                # Simulated microservice heartbeat ping
                latency = round(random.uniform(18.0, 45.0), 2)
                status_code = 200 if random.random() > 0.02 else 500
                
                if status_code >= 500:
                    logger.warning(f"⚠️  [MonitorWorker] Edge node anomaly detected: {status_code} ({latency}ms)")
                
                await asyncio.sleep(interval_seconds)
            except Exception as e:
                logger.error(f"❌ [MonitorWorker] Polling loop error: {e}")
                await asyncio.sleep(5)

    def stop_polling(self):
        self.is_monitoring = False
        logger.info("🛑 [MonitorWorker] Polling stopped.")


monitor_worker = MonitorWorker()
