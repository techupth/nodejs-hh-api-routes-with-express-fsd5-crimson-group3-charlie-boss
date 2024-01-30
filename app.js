// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

let assignmentsDatabase = assignments;

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 3) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 10 assignments per request",
    });
  }
  const assignementsWithLimit = assignmentsDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignementsWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignementsIdFromClient = Number(req.params.assignmentsId);
  let assignementsData = assignmentsDatabase.filter(
    (item) => item.id === assignementsIdFromClient
  );
  console.log(Number(req.params.assignmentsId));

  return res.json({
    message: "Complete Fetching assignments",
    data: assignementsData[0],
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/assignments", (req, res) => {
  let assignementsNewData = {
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  };
  assignmentsDatabase.push(assignementsNewData);
  return res.json({
    message: "New assignment has been created successfully",
    data: assignementsNewData,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  const assignmentsIdFromClient = Number(req.params.assignmentsId);

  const newAssignments = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentsIdFromClient;
  });

  if (newAssignments.length === assignmentsDatabase.length) {
    return res.status(401).json({
      message: "Cannot delete, No data available!",
    });
  }

  assignmentsDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  const assignmentsIdFromClient = Number(req.params.assignmentsId);
  const assignmentsIndex = assignmentsDatabase.findIndex((item) => {
    return item.id === assignmentsIdFromClient;
  });

  if (assignmentsIndex === -1) {
    return res.status(401).json({
      message: "Cannot updata, No data available!",
    });
  }

  assignmentsDatabase[assignmentsIndex] = {
    id: assignmentsIdFromClient,
    ...req.body,
  };
  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient}  has been updated successfully`,
    data: assignmentsDatabase[assignmentsIndex],
  });
});
