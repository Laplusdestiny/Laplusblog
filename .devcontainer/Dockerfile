FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# 記事画像の変換・リサイズ用 (例: convert in.jpg -resize 1600x -quality 80 out.webp)
RUN apt-get update \
	&& export DEBIAN_FRONTEND=noninteractive \
	&& apt-get install -y --no-install-recommends imagemagick webp \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
