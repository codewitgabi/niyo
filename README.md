<div align="center">
    <h2>Niyo Task Management</h2>
    <div align="center">
        <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/t/codewitgabi/niyo">
        <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/codewitgabi/niyo">
        <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/codewitgabi/niyo">
        <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/codewitgabi/niyo">
        <img alt="GitHub License" src="https://img.shields.io/github/license/codewitgabi/niyo">
        <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/codewitgabi/niyo">
        <img alt="GitHub Tag" src="https://img.shields.io/github/v/tag/codewitgabi/niyo">
    </div>
</div>
<br><br><br>

#### Features

- **Authentication** - _User registration_ - _User login_
  <br>
- **Task management** - _Create task_ - _Retrieve task_ - _Update task_ - _Delete task_
  <br/>
- **Postman api documentation**

#### Tools

The Niyo task management system uses express.js and mongodb for the backend server and postman for its documentation. Libraries like express validator was used to manage request validation to prevent any data from being saved to the database.

#### Documentation

The official documentation for this application can be seen at [Niyo docs](https://documenter.getpostman.com/view/33752126/2sA3QmCuEV) for a more detailed description of how to use its endpoints.

#### Running the project locally

To get the project running on your local machine, start by cloning the repo and ensure you have a recent version of `nodejs` and `npm` installed. Create a `.env` file in the root of the project and add the values for the keys using the `.env.example` as a reference. Once that is done, you can go ahead and run the following commands

```shell
npm install
npm run dev
```

Your project should now be started on your [localhost](http://localhost:7000)
