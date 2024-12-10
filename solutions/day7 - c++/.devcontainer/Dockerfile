# Use a lightweight base image with C++ tools
FROM ubuntu:22.04

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Update package manager and install necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gdb \
    clang \
    wget \
    git \
    curl \
    sudo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set build arguments for user creation with default values
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

# Add a non-root user for VS Code
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

# Switch to the new user
USER ${USERNAME}

# Set the default working directory
WORKDIR /workspaces

# Expose port for debugging (optional)
EXPOSE 8080
