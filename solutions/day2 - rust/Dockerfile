# Dockerfile
FROM rust:latest

# Install additional tools you might need
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    build-essential

# Set the working directory
WORKDIR /workspace

# Copy project files (if any)
COPY . .

# Default command
CMD ["bash"]