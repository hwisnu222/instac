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

COPY --from=build-react /app/dist ./static

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
