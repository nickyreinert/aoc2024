# Use official .NET SDK image with F# support
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Install additional tools
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    vim \
    sudo

# Create vscode user with sudo permissions
RUN groupadd -r vscode \
    && useradd -m -s /bin/bash -g vscode -G sudo vscode \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

# Set working directory and ensure proper ownership
WORKDIR /app
RUN chown -R vscode:vscode /app

# Ensure dotnet tools are in PATH
ENV PATH="/home/vscode/.dotnet/tools:${PATH}"

# Set the default user to vscode
USER vscode

# Ensure .NET tools are installed for the vscode user
RUN dotnet tool list --global || true

# Default command
CMD ["/bin/bash"]
