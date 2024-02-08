#!/bin/sh
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_DEFAULT_REGION=eu-west-2

# Start Kinesalite
kinesalite --port 4567 &

# Create a stream
aws --endpoint-url http://localhost:4567 kinesis create-stream --stream-name user-limit-events --shard-count 1

echo "Kinesalite is running"

# Keep container running
tail -f /dev/null