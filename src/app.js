const express = require("express");
const cors = require("cors");

const {
  uuid,
  isUuid
} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const _FIND_INDEX = (arr, id) => {

  const REPO_INDEX = arr.findIndex(repo => repo.id === id);

  if (REPO_INDEX < 0) return false;
  return REPO_INDEX;
}

function id_validation(req, res, next) {
  const {
    id
  } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      error: "wrong id, or id does not exists"
    });
  }

  return next();
}

app.use("/repositories/:id", id_validation);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

    repositories.push(repository)
    return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {
    id
  } = request.params;
  const {
    title,
    url,
    techs
  } = request.body;

  const _INDEX = _FIND_INDEX(repositories, id)

  if (_INDEX >= 0) {
    const repo = {
      ...repositories[_INDEX],
      "title": title,
      "url": url,
      "techs": techs
    }
    repositories[_INDEX] = (repo)
    return response.status(200).json(repositories[_INDEX])
  }
  return res.status(400).json({error: "Project not found."});
});

app.delete("/repositories/:id", (req, res) => {
  const {
    id
  } = req.params;

  const _INDEX = _FIND_INDEX(repositories, id)

  if(_INDEX >= 0 ){
    repositories.splice(_INDEX, 1);
    res.status(204).json({
    success: "the repository was deleted succefully"
  })
  }else {
    return res.status(400).json({
      error: "Not an actual repository, or wrong id was passed"
    })
  }

  
});

app.post("/repositories/:id/like", (req, res) => {
  const {
    id
  } = req.params;

  const _INDEX = _FIND_INDEX(repositories, id);

  if(_INDEX >= 0){
    repositories[_INDEX].likes += 1
    return res.status(200).json(repositories[_INDEX])
  }
  
  return res.status(400).json({
    error: "Not an actual repository, or wrong id was passed"
  })
});

module.exports = app;