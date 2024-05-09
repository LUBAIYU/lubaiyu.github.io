---
title: RPC框架 Dubbo
createTime: 2024/05/09 14:45:00
author: 路白榆
tags:
  - 远程调用
  - rpc
permalink: /cloud/as7h8eb5/
---

#### 在服务提供者进行配置

1.在application.yml中添加配置

```yaml
dubbo:
  application:
    name: provider
  protocol:
    name: dubbo
    port: -1
  registry:
    address: nacos://localhost:8848
```

<br>

2.创建接口（示例）

```java
package com.example.common.service;

/**
 * 对外暴露的接口
 * @author by
 */
public interface InnerUserInterfaceService {

    /**
     * 统计接口调用次数
     *
     * @param interfaceInfoId 接口ID
     * @param userId          用户ID
     * @return 布尔值
     */
    public boolean invokeCount(long interfaceInfoId, long userId);
}
```

<br>

3.创建接口实现类（示例）

```java
package com.example.server.service.inner;

import com.example.common.service.InnerUserInterfaceService;
import com.example.server.service.UserInterfaceService;
import org.apache.dubbo.config.annotation.DubboService;

import javax.annotation.Resource;

/**
 * 对外暴露的Dubbo服务
 * @author by
 */
@DubboService
public class InnerUserInterfaceServiceImpl implements InnerUserInterfaceService {

    @Resource
    private UserInterfaceService userInterfaceService;

    /**
     * 统计接口调用次数
     *
     * @param interfaceInfoId 接口ID
     * @param userId          用户ID
     * @return 布尔值
     */
    @Override
    public boolean invokeCount(long interfaceInfoId, long userId) {
        return userInterfaceService.invokeCount(interfaceInfoId, userId);
    }
}
```

<br>

4.在启动类添加注解`@EnableDubbo`

```java
@SpringBootApplication(scanBasePackages = {"com.example.common", "com.example.server"})
@EnableDubbo
public class ByapiServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ByapiServerApplication.class, args);
    }
}
```

<br>

#### 在服务消费者进行配置

1.在application.yml进行配置

```yaml
dubbo:
  application:
    name: consumer
  protocol:
    name: dubbo
    port: -1
  registry:
    address: nacos://localhost:8848
```

<br>

2.调用接口（示例）

使用注解`@DubboReference`调用

```java
@Component
public class CustomGlobalFilter implements GlobalFilter, Ordered {
    
    @DubboReference
    private InnerUserInterfaceService innerUserInterfaceService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return null;
    }

    @Override
    public int getOrder() {
        return -1;
    }

    public Mono<Void> handleNoAuth(ServerHttpResponse response) {
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return response.setComplete();
    }

    public Mono<Void> handleInvokeError(ServerHttpResponse response) {
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        return response.setComplete();
    }
}
```

<br>

3.在启动类添加注解`@EnableDubbo`

```java
/**
 * @author by
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableDubbo
public class ByapiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ByapiGatewayApplication.class, args);
    }
}
```



