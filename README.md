[![pipeline status](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2024/team/mondaywednesdaylecture/T_25/card-engine/badges/main/pipeline.svg)](https://git.doit.wisc.edu/cdis/cs/courses/cs506/sp2024/team/mondaywednesdaylecture/T_25/card-engine/-/commits/main)

# Card Engine

## How to develop using the CSL machines

```bash
ssh -L 8080:localhost:8080 -L 3000:localhost:3000 username@cs506-team-25.cs.wisc.edu
```

## How to use the docker compose

* Start the docker daemon
* Run the following to startup services

```bash
docker compose up
```

## How to Use The Frontend

```bash
cd ./frontend
npm install
npm run dev
```

## How to Use The Backend

```bash
cd ./backend
./gradlew bootrun
```
