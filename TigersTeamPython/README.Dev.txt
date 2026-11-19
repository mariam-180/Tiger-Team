Docker files were created using the `docker init` command.
------------------------------------------------------------
------------------------------------------------------------

Create your own version of `compose.override.yaml` and add your local ports.
It should look something like this: 
```
services:
  db:
    ports:
      -50902:5432
  tigers-team:
    ports:
      - 50901:80
    command: uvicorn src.app:app --reload --host 0.0.0.0 --port 80
```
------------------------------------------------------------
------------------------------------------------------------

Create your own version `.env` and add your values. Refer to `.env.sample` file.

```
# DB specific env variables
MYSQL_ROOT_PASSWORD=secret-root-pw

MYSQL_USER=mysql
MYSQL_PASSWORD=mysql

MYSQL_DATABASE=mysql
MYSQL_HOST=db    # Db container name
MYSQL_PORT=3306

# Service specific env variables
ENV=dev
PROJECT_NAME=Tigers-Team API

```
------------------------------------------------------------
------------------------------------------------------------

