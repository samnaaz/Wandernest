const app = require("./app");
const { port } = require("./src/config/env");

app.listen(port, () => {
  console.log(`WanderNest backend listening on port ${port}`);
});
