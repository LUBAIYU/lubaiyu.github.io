---
title: AOP
author: 路白榆
tags:
  - 面向切面编程
  - spring特性
createTime: 2024/04/20 13:13:03
permalink: /spring/ds7h8ebp/
---

面向切面编程

相关术语：

切入点（PointCut）：被标识为需要增强处理的连接点

连接点（JoinPoint）：指程序运行中的一些时间点（如方法调用或异常抛出）

切面（Aspect）：封装用于横向插入系统的功能（如事务、日志等）的类

通知/增强处理（Advice）：指在切入点执行的增强处理代码，可以理解为切面类中的方法，是切面的具体实现

<br>

#### 1.引入依赖

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

<br>

#### 2.编写切面类

```java
/**
 * 切面类
 */
@Aspect
@Component
public class MyAspect {

    //切入点表达式
    @Pointcut("execution(void com.example.service.UserService.save())")
    public void pointcut() {
    }

    //环绕通知
    @Around("pointcut()")
    public Object strengthen(ProceedingJoinPoint joinPoint) throws Throwable {
        //输出当前系统时间
        System.out.println(LocalDateTime.now());
        //执行原始方法
        Object obj = joinPoint.proceed();
        //输出当前系统时间
        System.out.println(LocalDateTime.now());
        return obj;
    }
}
```

<br>

#### 3.开启AOP功能支持

由于spring-boot-starter-aop依赖已经默认开启AOP支持，所以以下注解可加可不加

```java
@SpringBootApplication
@EnableAspectJAutoProxy
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```



