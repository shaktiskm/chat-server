# Chat Server


## Setup

1. Please use node v4.4.0 as application is tested on this version.

2. Check the npm packages:

    ```
    npm install
    ```

3. Start the application

    ```
    node dist/api.js
    ```

## Managing the project with Grunt

* install
  ```
  npm install -g grunt-cli
  npm install grunt
  ```

* Runs eslint, babel:dist

    ```
    grunt
    ```

* Compiles the .es6 files to .js
 
    ```
    grunt babel:dist
    ```

* Lints the .es6 files

    ```
    grunt eslint
    ```
