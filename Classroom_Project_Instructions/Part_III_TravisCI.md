# Part 3 - Set up Travis continuous integration pipeline

Prior to setting up a multi-container application in Kubernetes, you will need to set up a CI pipeline to build and push our application code as Docker images in DockerHub. 

The end result that we want is a setup where changes in your GitHub code will automatically trigger a build process that generates Docker images.

### Create Dockerhub Repositories

Log in to https://hub.docker.com/ and create four public repositories - each repository corresponding to your local Docker images.

* `reverseproxy`
* `udagram-api-user`
* `udagram-api-feed`
* `udagram-frontend`

> Note: The names of the repositories are exactly the same as the `image name` specified in the *docker-compose-build.yaml* file

### Set up Travis CI Pipeline

Use Travis CI pipeline to build and push images to your DockerHub registry. 

1. Create an account on https://travis-ci.com/ (not https://travis-ci.org/). It is recommended that you sign in using your Github account.

2. Integrate Github with Travis: Activate your GitHub repository with whom you want to set up the CI pipeline. 

3. Set up your Dockerhub username and password in the Travis repository's settings, so that they can be used inside of `.travis.yml` file while pushing images to the Dockerhub. 
    * `DOCKER_USERNAME`
    * `DOCKER_PASSWORD`

4. Add a `.travis.yml` configuration file to the project directory locally. 

    In addition to the mandatory sections, your Travis file should automatically read the Dockerfiles, build images, and push images to DockerHub. 

    #### Build
    ```bash
    docker build -t udagram-api-feed ./udagram-api-feed
    docker build -t udagram-api-user ./udagram-api-user
    docker build -t udagram-frontend ./udagram-frontend
    docker build -t udagram-reverseproxy ./udagram-reverseproxy
    ```

    #### Tagging
    ```bash
    docker tag udagram-api-feed <your-docker-username>/udagram-api-feed:v1
    docker tag udagram-api-user <your-docker-username>/udagram-api-user:v1
    docker tag udagram-frontend <your-docker-username>/udagram-frontend:v1
    docker tag udagram-reverseproxy <your-docker-username>/udagram-reverseproxy:v1
    ```

    #### Push
    ```bash
    # Assuming DOCKER_PASSWORD and DOCKER_USERNAME are set in the Travis repository settings
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    docker push <your-docker-username>/udagram-api-feed:v1
    docker push <your-docker-username>/udagram-api-user:v1
    docker push <your-docker-username>/udagram-frontend:v1
    docker push <your-docker-username>/udagram-reverseproxy:v1
    ```

    #### Complete `.travis.yml` Example
    ```yaml
    language: node_js
    node_js:
      - "node"

    services:
      - docker

    # Pre-processing
    install:
      - echo "nothing needs to be installed"

    # Method of execution
    script:
      - docker --version
      - docker build -t udagram-api-feed ./udagram-api-feed
      - docker build -t udagram-api-user ./udagram-api-user
      - docker build -t udagram-frontend ./udagram-frontend
      - docker build -t udagram-reverseproxy ./udagram-reverseproxy
      # Tagging
      - docker tag udagram-api-feed $DOCKER_USERNAME/udagram-api-feed:v1
      - docker tag udagram-api-user $DOCKER_USERNAME/udagram-api-user:v1
      - docker tag udagram-frontend $DOCKER_USERNAME/udagram-frontend:v1
      - docker tag udagram-reverseproxy $DOCKER_USERNAME/udagram-reverseproxy:v1

    # Tasks to perform after the process is successful.
    after_success:
      - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
      - docker push $DOCKER_USERNAME/udagram-api-feed:v1
      - docker push $DOCKER_USERNAME/udagram-api-user:v1
      - docker push $DOCKER_USERNAME/udagram-frontend:v1
      - docker push $DOCKER_USERNAME/udagram-reverseproxy:v1
    ```

> **Tip**: Use different tags each time you push images to the Dockerhub.   


5. Trigger your build by pushing your changes to the Github repository. All of these steps mentioned in the `.travis.yml` file will be executed on the Travis worker node. It may take upto 15-20 minutes to build and push all four images.


6. Verify if the newly pushed images are now available in your Dockerhub account.


### Screenshots
So that we can verify your project’s pipeline is set up properly, please include the screenshots of the following:

1. DockerHub showing images that you have pushed
2. Travis CI showing a successful build job


### Troubleshooting

If you are not able to get through the Travis pipeline, and still want to push your local images to the Dockerhub (only for testing purposes), you can attempt the manual method. 

Note that this is only for the troubleshooting purposes, such as verifying the deployment to the Kubernetes cluster.

* Log in to the Docker from your CLI, and tag the images with the name of your registry name (Dockerhub account username). 
  ```bash
  # See the list of current images
  docker images
  # Use the following syntax
  # In the remote registry (Dockerhub), we can have multiple versions of an image using "tags". 
  # docker tag <local-image-name:current-tag> <registry-name>/<repository-name>:<new-tag>
  docker tag <local-image:tag> <dockerhub-username>/<repository>:<tag>
  ```
* Push the images to the Dockerhub. 
  ```bash
  docker login --username=<your-username>
  # Use the "docker push" command for each image, or 
  # Use "docker-compose -f docker-compose-build.yaml push" if the names in the compose file are as same as the Dockerhub repositories. 
  ```


