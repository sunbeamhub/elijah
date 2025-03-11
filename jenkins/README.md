## Jenkins 部署

- 安装 Docker
- 创建本地私有 Docker 镜像仓库 `docker pull registry:2 && docker run -d -p 5000:5000 --name registry registry:2`
- 安装 Jenkins `docker pull jenkinsci/blueocean && docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkinsci/blueocean`
- 初始化 Jenkins `docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
