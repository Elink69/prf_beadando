# Dockerfile a mongo-dump betöltéséhez
FROM mongo
COPY mongo-dump /dump
COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT [ "/start.sh" ]