---
title: 注册中心
author: 路白榆
article: true
createTime: 2024/04/20 15:56:03
permalink: /cloud/as7h8ebp/
---

#### 1.Eureka

##### 服务端配置

需新建一个模块作为服务端并进行以下配置，同时将模块自身注册到Eureka中

pom.xml引入以下依赖

```java
<!--引入Eureka服务端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

<br>

application.yml进行以下配置

```java
eureka:
  client:
    service-url:      #eureka的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
```

<br>

##### 客户端配置

新建其他模块并进行以下配置，将其他模块作为客户端并注册到Eureka中

pom.xml引入以下依赖

```java
<!--引入Eureka客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

<br>

application.yml进行以下配置

```java
eureka:
  client:
    service-url:      #eureka的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
```

<br>

#### 2.Nacos

##### 使用配置

想要注册到Nacos中的服务进行以下配置

pom.xml引入以下依赖

```java
<!--引入Nacos客户端依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

<br>

application.yml进行以下配置

```java
spring:
  cloud:
    nacos:
      server-addr: localhost:8848    #nacos客户端地址
```

<br>

##### 服务多级存储模型

服务 > 集群 > 实例

配置集群，集群名称可任意命名

application.yml进行以下配置

```java
spring:
  cloud:
    nacos:
      discovery:
        cluster-name: GZ  #配置集群名称，这里GZ代表广州
```

<br>

若想将同一个服务的不同实例运行在不同集群中，可以这样子做：

假如有服务UserService，它有两个实例UserService1和UserService2，这时可以先按上述配置运行UserService1，然后更改配置，将上述集群名称改一下，改为SH，然后再运行UserService2，这时查看注册中心便能发现UserService1在集群GZ中，UserService2在集群SH中

<br>

优先调用本地集群实例，在调用者服务的application.yml中进行配置

```java
#要做配置的服务名称，指定优先调用本地集群的实例
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule
```

补充说明：若本地集群中没有可调用的实例，则会跨集群调用可用的实例

<br>

##### 统一配置管理

###### 1.实现配置管理

1.点击右上角的加号

![](https://img2.imgtp.com/2024/04/18/a4VhyldY.png)

<br>

2.填写配置信息

![](https://img2.imgtp.com/2024/04/18/4Ar9az4A.png)

<br>

3.发布配置

<br>

###### 2.微服务配置拉取

1.在pom.xml进行以下配置

```java
<!--引入Nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

<br>

2.在resources目录下创建bootstrap.yml文件，并进行以下配置

```java
spring:
  application:
    name: userservice
  profiles:
    active: dev  #开发环境
  cloud:
    nacos:
      server-addr: localhost:8848
      config:
        file-extension: yaml  #文件后缀名
```

<br>

补充说明：此配置对应nacos中id为userservice-dev.yaml的配置文件

<br>

###### 3.配置热更新

在控制器类上面加一个注解@RefreshScope

```java
package cn.itcast.user.web;

import cn.itcast.user.pojo.User;
import cn.itcast.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
@RefreshScope
public class UserController {

    @Value("${pattern.dateformat}")
    private String dateformat;

    @GetMapping("/now")
    public String now() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateformat));
    }
}

```

<br>

###### 4.多环境配置共享

在Nacos中新建一个userservice.yaml配置文件，则当项目启动时无论处于哪种环境都会读取该配置文件

![](https://img2.imgtp.com/2024/04/18/kiLBsB6L.png)

<br>

多种配置的优先级：

服务名-profile.yaml > 服务名.yaml > 本地配置

如：userservice-dev.yaml > userservice.yaml > application.yml

