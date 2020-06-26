const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const students = ["Carlie", "James", "Sam", "Todd"];

const randomPair = () => {
  let student1 = Math.floor(Math.random() * students.length);
  let student2 = Math.floor(Math.random() * students.length);
  return [students[student1], students[student2]];
};

// When we create an http server, we pass it a callback function that performs the actions of the server
const controller = (req, res) => {
  const { method, url, header } = req;
  if (method === "GET" && url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(randomPair()));
  } else if (method === "GET" && url === "/students") {
    res.statusCode = 200; // status code
    res.setHeader("Content-Type", "application/json"); // header
    res.end(JSON.stringify(students)); // body
  } else if (method === "POST" && url === "/students") {
    let data = [];
    res.on("data", (chunk) => {
      data.push(chunk);
    });

    res.on("end", () => {
      data = Buffer.concat(data).toString();
      data = JSON.parse(data);
      students.push(data.name);
      res.statusCode = 201;
      res.end(JSON.stringify(students));
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
};

const server = http.createServer(controller);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
