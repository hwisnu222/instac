FROM node:22-slim AS build-react
WORKDIR /app

COPY web/package*.json ./

RUN npm ci

COPY web/ ./
RUN npm run build


FROM python:3.12

WORKDIR /app/server

COPY server/requirements.txt ./

RUN pip install -r requirements.txt

COPY server/ ./

COPY --from=build-react /app/web/build ./static

EXPOSE 80

CMD ["fastapi", "run", "main.py"]
