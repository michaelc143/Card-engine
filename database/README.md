# Running the compose

To spin up the containers for the db, backend, and phpmyadmin, run the following command from within the /database folder:

```bash
docker compose -f db_setup.yml up -d
```

Running this command will spin up the frontend, backend, and database as well as PHPMyAdmin to view/edit the db.
