# Dockerfile a mongo-dump betöltéséhez
FROM mongo
COPY mongo-dump /dump
CMD ["mongorestore", "--host", "mongo", "--dir", "/dump"]