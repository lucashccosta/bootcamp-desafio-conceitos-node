const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const middlewares = require("./middlewares");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  const results = title ? repositories.filter(repo => repo.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repo = { id: uuid(), title, url, techs, likes: 0 };

    repositories.push(repo);

    return response.status(201).json(repo);
});

app.put("/repositories/:id", middlewares.validateId, middlewares.existsId(repositories),  (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
    const oldRepo = repositories[request.repoIndex];
    
    repositories[request.repoIndex] = {
        id,
        title: title ? title : oldRepo.title,
        url: url ? url : oldRepo.url,
        techs: techs ? techs : oldRepo.techs,
        likes: oldRepo.likes
    };

    return response.json(repositories[request.repoIndex]);
});

app.delete("/repositories/:id", middlewares.validateId, middlewares.existsId(repositories), (request, response) => {
    repositories.splice(request.repoIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", middlewares.validateId, middlewares.existsId(repositories), (request, response) => {
    let repo = repositories[request.repoIndex];
    repo = {...repo, likes: repo.likes + 1};

    repositories[request.repoIndex] = repo;

    return response.json(repo);
});

module.exports = app;
