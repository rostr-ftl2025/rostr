FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5006

CMD ["python", "-m", "flask", "run", "--debug", "--host=0.0.0.0", "--port=5006"]
