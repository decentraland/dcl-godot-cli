FROM ubuntu:22.04

ARG DCL_GODOT_VERSION="v0.6.0-alpha"

WORKDIR /app

# Install dependencies
RUN apt-get update -y \
    && apt-get -y install \
        xvfb libasound2-dev libudev-dev \
        clang curl pkg-config libavcodec-dev libavformat-dev libavutil-dev libavfilter-dev libavdevice-dev \
        libssl-dev libx11-dev libgl1-mesa-dev libxext-dev gnupg wget unzip

# Install node
RUN curl -sL https://deb.nodesource.com/setup_20.x  | bash -
RUN apt-get -y install nodejs

# Clean apt cache
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Download Dcl Godot Explorer
ENV EXPLORER_PATH=/explorer
RUN mkdir -p ${EXPLORER_PATH} \
    && cd ${EXPLORER_PATH} \
    && wget -O explorer.zip https://github.com/decentraland/godot-explorer/releases/download/${DCL_GODOT_VERSION}/decentraland-godot-ubuntu-latest-1.zip \
    && unzip explorer.zip \
    && chmod +x decentraland.godot.client.x86_64 \
    && rm explorer.zip

COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]