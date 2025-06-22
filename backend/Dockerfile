# Use an official Python image
FROM python:3.11-slim

# Install Nmap and other dependencies
RUN apt-get update && \
    apt-get install -y nmap gcc && \
    apt-get clean

# Set work directory
WORKDIR /app

# Copy the requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Expose port
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
