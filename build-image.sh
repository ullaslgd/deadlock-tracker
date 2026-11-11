
#!/usr/bin/env bash

set -e

IMAGE_NAME="deadlock-codex"
IMAGE_TAG="latest"

echo "Building Deadlock Codex Docker image..."

docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

echo "Docker image built successfully!"
