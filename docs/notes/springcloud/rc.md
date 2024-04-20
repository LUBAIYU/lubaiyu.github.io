---
title: 远程调用
author: 路白榆
tags:
  - 远程调用
article: true
createTime: 2024/04/20 15:53:03
permalink: /article/ds7h8eba/
---

#### 1.RestTemplate

以下代码可加在配置类中或者加在启动类中

```java
/**
 * 用于远程调用
 * @return
 */
@Bean
@LoadBalanced     //负载均衡
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

<br>

使用RestTemplate发送请求

```java
package cn.itcast.order.service;

import cn.itcast.order.mapper.OrderMapper;
import cn.itcast.order.pojo.Order;
import cn.itcast.order.pojo.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);
        //2.拼接访问另一个服务的路径
        String url = "http://userservice/user/" + order.getUserId();
        //3.使用restTemplate访问服务
        User user = restTemplate.getForObject(url, User.class);
        order.setUser(user);
        // 4.返回
        return order;
    }
}
```

<br>

#### 2.http客户端Feign

##### 定义和使用Feign

1.引入依赖

```java
<!--开启Feign客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

<br>

2.在启动类上加注解@EnableFeignClients

```java
@MapperScan("cn.itcast.order.mapper")
@EnableFeignClients
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}
```

<br>

3.编写Feign客户端

```java
package cn.itcast.order.clients;

import cn.itcast.order.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("userservice")
public interface UserClient {

    @GetMapping("/user/{id}")
    User findById(@PathVariable Long id);
}
```

<br>

##### Feign的性能优化

Feign底层的客户端实现：

1.URLConnection: 默认实现，不支持连接池

2.Apache HttpClient: 支持连接池

3.OKHttp: 支持连接池

<br>

优化Feign的性能主要包括：

1.使用连接池代替默认的URLConnection

2.日志级别，最好使用basic或none

<br>

Feign添加HttpClient的支持

1.引入依赖

```java
<!--引入HttpClient依赖-->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

<br>

2.在application.yml中进行配置

```java
feign:
  httpclient:
    enabled: true   #开启httpclient的开关
    max-connections: 200     #最大连接数
    max-connections-per-route: 50     #单个路径的最大连接数
```

