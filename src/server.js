import connectDb from "./config/db.config.js";
import app from "./app.js";

const runserver = async () => {
  await connectDb()
    .then(() => {
      app.listen(app.get("port"), () => {
        console.log(`Server is running on port ${app.get("port")}`);
      });
    })
    .catch((error) => console.error(error?.message));
};

runserver();
