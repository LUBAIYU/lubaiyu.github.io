---
title: Docker
author: 路白榆
createTime: 2024/04/21 14:13:19
permalink: /center/8wsdk9g9/
---

### Docker

#### 初识Docker

Docker是一个快速交付应用，运行应用的技术：

1.可以将程序及其依赖、运行环境一起打包为一个镜像，可以迁移到任意Linux操作系统

2.运行时利用沙箱机制形成隔离容器，各个应用互不干扰

3.启动、移除都可以通过一行命令完成，方便快捷

<br>

镜像：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像

容器：镜像中的应用程序运行后形成的进程就是容器，只是Docker会给容器做隔离，对外不可见

<br>

Docker架构：

服务端：Docker守护进程，负责处理Docker指令，管理镜像、容器等

客户端：通过命令或RestAPI向Docker服务端发送指令，可以在本地或远程向服务端发送指令

<br>

#### 使用Docker

##### 1.镜像命令

docker pull 镜像名称 : 版本号 功能：从镜像服务器DockerHub拉取镜像

例：docker pull MySQL:5.7

补充：如果不加版本号则默认拉取最新版本的镜像

<br>

docker rmi 镜像名称 : 版本号/镜像ID 功能：从本地镜像中删除指定镜像

例：docker rmi MySQL : 5.7

<br>

docker images 功能：查看本地所有镜像

docker push 功能：向镜像服务器推送指定镜像

docker save 功能：将指定镜像导出到磁盘中

docker load 功能：从本地磁盘加载镜像到Docker中

补充：以上命令具体用法较多，可用docker 操作名称 --help查看具体用法及说明

例：docker push --help

<br>

##### 2.容器命令

docker run 功能：运行容器

常见参数：

--name：指定容器名称

-p：指定端口映射

-d：让容器后台运行

常用：docker run --name 容器名称 -p 本地端口：容器端口 -d 镜像名称

例：docker run --name mn -p 80:80 -d nginx

<br>

docker pause 功能：将运行中的容器暂停

docker unpause 功能：将暂停中的容器恢复运行

docker stop 功能：将运行中的容器停止

docker start 功能：将停止中的容器恢复运行

docker ps 功能：查看所有运行的容器及状态

docker logs 功能：查看容器运行日志

docker rm(容器ID或名称)  功能：删除指定容器（需要先停止容器）

<br>

docker exec 功能：进入容器执行命令

常用：docker exec -it 容器名称 bash

例：docker exec -it mn bash 进入容器并开启交互功能

<br>

##### 3.数据卷命令

数据卷是一个虚拟目录，指向宿主机文件系统中的某个目录

数据卷的作用：将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全

命令语法：docker volume 具体命令

docker volume create 功能：创建一个volumn

docker volume inspect 功能：显示一个或多个volumn的信息

docker volume ls 功能：列出所有的volumn

docker volume prune 功能：删除未使用的volume

docker volume rm 功能：删除一个或多个指定的volumn

<br>

将容器中的文件挂载到指定文件：

命令 :  -v 数据卷名称：容器内目录

-v 宿主机文件：容器内文件

-v 宿主机目录：容器内目录

例：docker run --name mn -p 80:80 -v html:/user/share/nginx/html -d nginx

<br>

#### 自定义镜像

##### 1.镜像结构

镜像是分层结构，每一层称为一个Layer

BaseImage层：包含基本的系统函数库、环境变量、文件系统

Entrypoint：入口，是镜像中应用启动的命令

其他：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

<br>

##### 2.Dockerfile

Dockerfile是一个文本文件，其中包含一个个的指令，用指令来说明要执行什么操作来构建镜像。每一个指令都会形成一层Layer

<br>

常见指令：

指令 说明 示例

FROM 指定基础镜像 FROM centos:6

ENV 设置环境变量，可在后面指令使用 ENV key value

COPY 拷贝本地文件到镜像的指定目录 COPY ./mysql-5.7.rpm /tmp

RUN 执行Linux的shell命令，一般是安装过程的命令 RUN yum install gcc

EXPOSE 指定容器运行时监听的端口，是给镜像使用者看的 EXPOSE 8080

ENTRYPOINT 镜像中应用的启动命令，容器运行时调用 ENTRYPOINT java -jar xx.jar

<br>

##### 3.DockerCompose

Docker Compose可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器

Compose文件是一个文本文件，通过指令定义集群中的每个容器如何运行