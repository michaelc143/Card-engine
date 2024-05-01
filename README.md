# Card Engine

## How to use the docker compose

* Start the docker daemon
* Run the following to startup services

```bash
cd ./database
docker compose -f db_setup.yml up -d --build
```

To make edits to the database while the compose is running, run the following:

```bash
docker exec -it database-db2-1 mysql -u root -p
```

If you make edits to the backend API, you must restart the backend container in order for the changes to take effect in the running container.

Recommended frontend usage: Run locally and run the rest of the services in the compose to see live updates from the frontend.

## How to Use The Frontend Locally without the Compose

```bash
cd ./frontend
npm install
npm run dev
```

## How to run the frontend linter

```bash
cd ./frontend
npm run lint
```

## How to Use The Backend Locally without the Compose

```bash
cd ./backend
./gradlew bootrun
```
