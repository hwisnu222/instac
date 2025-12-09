dev:
	uvicorn server.src.main:app --reload

env:
	source server/env/bin/activate

freeze:
	pip freeze > ./server/requirements.txt
