# Use an official Ruby image as the base
FROM ruby:3.2

# Set environment variables
ENV LANG=C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    zlib1g-dev \
    libssl-dev \
    libreadline-dev \
    libyaml-dev \
    libsqlite3-dev \
    sqlite3 \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (for security)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME
RUN useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
RUN apt-get install -y 
# RUN sudo echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME
# RUN sudo chmod 0440 /etc/sudoers.d/$USERNAME

# Set user to vscode
USER $USERNAME

# Set up the working directory
WORKDIR /workspace

# Install Bundler for managing Ruby gems
RUN gem install bundler

# Expose port 3000 (useful for Ruby on Rails)
EXPOSE 3000

# Set the default command
CMD [ "irb" ]
