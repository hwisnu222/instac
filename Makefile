run:
	uvicorn main:app

env:
	source server/env/bin/activate

freeze:
	pip freeze -r requirements.txt
