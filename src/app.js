const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// should be able to list the repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

// should be able to create a new repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo);

  return response.json(repo);
});

// should be able to update repository
// should not be able to update a repository that does not exist
// should not be able to update repository likes manually
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex( repo => repo.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).send('Repositório não existe');
  }

  const newRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes   
  };

  repositories[repositoryIndex] = newRepo;
  return response.json(newRepo);

});

// should be able to delete the repository
// should not be able to delete a repository that does not exist
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex( repo => repo.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).send('Repositório não existe');
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send()  
});

// should be able to give a like to the repository
// should not be able to like a repository that does not exist
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex( repo => repo.id == id);
  if(repositoryIndex < 0) {
    return response.status(400).send('Repositório não existe');
  }

  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
