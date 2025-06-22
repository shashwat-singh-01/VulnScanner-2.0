# Dockerfile at root (for Railway)
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y nmap gcc && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy backend code
COPY ./backend /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI default port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
