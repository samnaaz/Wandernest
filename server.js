const app = require("../app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`WanderNest backend listening on port ${port}`);
});
