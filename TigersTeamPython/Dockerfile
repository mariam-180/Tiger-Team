# syntax=docker/dockerfile:1
FROM python:3.12-slim-bookworm AS wheels
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential pkg-config default-libmysqlclient-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM python:3.12-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libmariadb3 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
COPY --from=wheels /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && rm -rf /wheels
RUN adduser --disabled-password --gecos "" --no-create-home --uid 10001 appuser && mkdir -p /app/logs /app/static /app/uploads && chown -R appuser:appuser /app/logs /app/static /app/uploads
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 80
CMD ["gunicorn", "src.app:app", "--bind=0.0.0.0:80", "--workers=1", "--worker-class=uvicorn.workers.UvicornWorker"]
