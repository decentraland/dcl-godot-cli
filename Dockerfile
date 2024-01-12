FROM quay.io/decentraland/godot-explorer:f99a1ed32ab1cc7d7bb30c0f5ccf36b4840b4901

WORKDIR /app

COPY entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
