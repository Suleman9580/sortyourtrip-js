# Design

## Architecture
Express API + BullMQ + Redis worker.

## Agents
Destination uses trained JS softmax model.
Activities + transport heuristic.

Coordinator runs destination first then parallel agents.

## ML
Synthetic dataset.
JS softmax classifier.
Temperature scaling calibration.
Baseline heuristic comparison.

## Reliability
Timeouts, retry, fallback.

## Observability
Prometheus counters.
Structured reasoning.

## Tradeoffs
Skipped advanced metrics and UI due to time.
Would add tracing, persistence, better datasets in production.
