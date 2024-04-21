---
title: Gateway
author: 路白榆
article: true
createTime: 2024/04/21 14:05:03
permalink: /cloud/as7h8eb1/
---

### 统一网关Gateway

#### 为什么需要网关

网关功能：

1.身份认证和权限校验

2.服务路由，负载均衡

3.请求限流

<br>

#### 搭建网关服务

1.创建新的模块，引入相关依赖

```java
<!--引入nacos服务发现依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<!--引入gateway网关依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

<br>

编写路由配置及nacos地址

```java
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848     #nacos地址
    gateway:
      routes:
        - id: user-service            #路由标识，必须唯一
          uri: lb://userservice       #路由的目标地址，lb代表负载均衡
          predicates:                 #路由断言，判断请求是否符合规则
            - Path=/user/**           #路由断言，判断请求路径是否以/user开头
        - id: order-service
          uri: lb://orderservice
          predicates:
            - Path=/order/**
```

<br>

#### 全局过滤器

过滤器示例：

```java
package cn.itcast.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(-1)   //指定过滤器的执行优先级，数字越小优先级越高
@Component
public class AuthorizeFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        //1.获取请求
        ServerHttpRequest request = exchange.getRequest();
        //2.获取请求参数
        MultiValueMap<String, String> params = request.getQueryParams();
        //3.从参数中获取值
        String auth = params.getFirst("Authorization");
        //4.判断参数是否等于admin
        if("admin".equals(auth)){
            //5.如果是放行
            return chain.filter(exchange);
        }
        //6.如果不是，则拦截
        //6.1设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        //6.2拦截，请求结束
        return exchange.getResponse().setComplete();
    }
}
```

<br>

过滤器执行顺序（路由过滤器，默认过滤器，全局过滤器）：

1.order值越小，优先级越高

2.当order值一样时，顺序是默认过滤器最先，然后是局部的过滤器，最后是全局过滤器

<br>

#### 跨域问题处理

在application.yml中进行以下配置

```java
spring:
  cloud:
	gateway:
      globalcors:
        add-to-simple-url-handler-mapping: true
        cors-configurations:
          '[/**]':
            allowedOrigins:       # 允许哪些网站的跨域请求
              - "https://localhost:8090"
            allowedMethods:       # 允许的HTTP方法
              - "GET"
              - "POST"
              - "PUT"
              - "DELETE"
              - "OPTIONS"
            allowedHeaders:       # 允许的HTTP头部信息
              - "*"
            allowCredentials: true   # 是否允许携带Cookie
            maxAge: 360000        # 预检请求（OPTIONS请求）的缓存时间
```

