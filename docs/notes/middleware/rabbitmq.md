---
title: RabbitMQ
author: 路白榆
createTime: 2024/04/21 14:18:53
permalink: /center/uwnnt2yj/
---

### RabbitMQ

#### 同步调用

优势：时效性强，等待到结果才返回

问题：

1. 拓展性差
2. 性能下降
3. 级联失败问题

<br>

#### 异步调用

优势：

1. 耦合度低，拓展性强
2. 异步调用，无需等待，性能好
3. 故障隔离，下游服务故障不影响上游服务
4. 缓存消息，流量削峰填谷

问题：

1. 不能立即得到调用结果，时效性差
2. 不确定下游服务执行是否成功
3. 业务安全依赖于Broker的可靠性

<br>

#### 常见消息队列比较

![](https://img2.imgtp.com/2024/04/05/VoqFGjnC.png)

<br>

#### 运行

在docker容器内运行RabbitMQ：

```sh
docker run \
 -e RABBITMQ_DEFAULT_USER=root \
 -e RABBITMQ_DEFAULT_PASS=root \
 -v mq-plugins:/plugins \
 --name mq \
 --hostname mq \
 -p 15672:15672 \
 -p 5672:5672 \
 -d \
 rabbitmq:latest
```

端口15672：作为RabbitMQ管理平台的入口

端口5672：作为RabbitMQ消息发送的入口

<br>

> 运行后访问不了15672端口？

解决方法：

1. 进入容器

   ```bash
   docker exec -it 容器ID /bin/bash
   ```

2. 执行命令

   ```bash
   rabbitmq-plugins enable rabbitmq_management
   ```

3. 退出容器

   ```bash
   exit
   ```

<br>

> 交换机控制台报错Management API returned status code 500 -

解决方法：

1. 进入容器

```bash
docker exec -it 容器ID /bin/bash
```

2. 进入配置目录

```bash
cd /etc/rabbitmq/conf.d/
```

3. 执行命令

```bash
echo management_agent.disable_metrics_collector = false > management_agent.disable_metrics_collector.conf
```

4. 退出容器

```bash
exit
```

5. 重启rabbitmq

```bash
docker restart 容器名称
```

<br>

#### 概念

channel：通道，操作MQ的工具

exchange：交换机，路由消息到队列中

queue：队列，缓存消息

virtual host：虚拟主机，是对queue、exchange等资源的逻辑分组

<br>

#### SpringAMQP

AMQP是应用间消息通信的一种协议，与语言和平台无关

spring amqp是一组抽象接口，底层实现是spring-rabbit

<br>

##### 1.简单队列模型

特点：一条消息只能被一个消费者消费，当消息被消费后则从队列中删除

![](https://img2.imgtp.com/2024/04/18/Wo8JYFTr.png)

代码演示：

引入依赖

```java
<!--AMQP依赖，包含RabbitMQ-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

<br>

在生产者服务的application.yml中配置

```java
spring:
  rabbitmq:
    host: 192.168.198.132      #主机地址
    port: 5672                 #端口
    virtual-host: /            #虚拟主机
    username: root             #用户名
    password: root             #密码
```

<br>

使用RabbitTemplate发送消息

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void SpringAmqpSendMessage() {
        String queueName = "simple.queue";
        String message = "hello,spring amqp!";
        rabbitTemplate.convertAndSend(queueName, message);
    }
}
```

<br>

在消费者服务的application.yml中配置

```java
spring:
  rabbitmq:
    host: 192.168.198.132      #主机地址
    port: 5672                 #端口
    virtual-host: /            #虚拟主机
    username: root             #用户名
    password: root             #密码
```

<br>

消费消息

```java
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "simple.queue")
    public void SpringMQMessageListener(String msg) {
        System.out.println("消费者接收到simple.queue的消息：【" + msg + "】");
    }
}
```

<br>

2.工作队列模型

特点：一条消息只能被一个消费者消费，当消息被消费后则从队列中删除

![](https://img2.imgtp.com/2024/04/18/BSAJ6Dua.png)

Work queue：工作队列，可以提高消息处理速度，避免队列消息堆积

代码演示：

在生产者服务的application.yml中配置

```java
spring:
  rabbitmq:
    host: 192.168.198.132      #主机地址
    port: 5672                 #端口
    virtual-host: /            #虚拟主机
    username: root             #用户名
    password: root             #密码
```

<br>

使用RabbitTemplate发送消息

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void SpringAmqpWorkQueue() throws InterruptedException {
        String queueName = "simple.queue";
        String message = "hello,message__";
        for (int i = 1; i <= 50; i++) {
            rabbitTemplate.convertAndSend(queueName, message + i);
            //使线程休眠20ms，模拟1s发送50条消息
            Thread.sleep(20);
        }
    }
}
```

<br>

在消费者服务的application.yml中配置

```java
spring:
  rabbitmq:
    host: 192.168.198.132      #主机地址
    port: 5672                 #端口
    virtual-host: /            #虚拟主机
    username: root             #用户名
    password: root             #密码
    listener:
      simple:
        prefetch: 1            #每次只能读取一条消息，处理后才能获取下一个消息
```

<br>

消费消息

```java
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "simple.queue")
    public void SpringWorkQueue1Listener(String msg) throws InterruptedException {
        System.out.println("消费者1接收到消息：【" + msg + "】" + LocalTime.now());
        //使线程休眠20ms，模拟1s处理50个消息
        Thread.sleep(20);
    }

    @RabbitListener(queues = "simple.queue")
    public void SpringWorkQueue2Listener(String msg) throws InterruptedException {
        System.err.println("消费者2....接收到消息：【" + msg + "】" + LocalTime.now());
        //使线程休眠200ms，模拟1s处理5个消息
        Thread.sleep(200);
    }
}
```

<br>

如何解决消息堆积问题？

1. 一个队列绑定多个消费者，提高消息的处理速度
2. 优化业务代码，提高每个消费者的处理速度

<br>

##### 3.发布订阅模型

特点：加入了交换机exchange，允许将同一消息发送给多个消费者

常见交换机exchange类型包括：

Fanout：广播

Direct：路由

Topic：话题

![](https://img2.imgtp.com/2024/04/18/MxDlOKxD.png)

注意：exchange负责消息路由，而不是存储，路由失败则消息丢失

<br>

###### 1.Fanout Exchange

Fanout Exchange会将接收到的消息路由到每一个跟其绑定的queue

![](https://img2.imgtp.com/2024/04/18/DjtKVSHD.png)

代码演示：

在消费者服务配置交换机和队列

```java
@Configuration
public class FanoutConfig {

    //声明交换机
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("itcast.fanout");
    }

    //声明队列1
    @Bean
    public Queue fanoutQueue1() {
        return new Queue("fanout.queue1");
    }

    //将队列1绑定到交换机
    @Bean
    public Binding bindingQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange) {
        return BindingBuilder
                .bind(fanoutQueue1)
                .to(fanoutExchange);
    }

    //声明队列2
    @Bean
    public Queue fanoutQueue2() {
        return new Queue("fanout.queue2");
    }

    //将队列2绑定到交换机
    @Bean
    public Binding bindingQueue2(Queue fanoutQueue2, FanoutExchange fanoutExchange) {
        return BindingBuilder
                .bind(fanoutQueue2)
                .to(fanoutExchange);
    }

}
```

<br>

在消费者服务编写以下代码

```java
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "fanout.queue1")
    public void FanoutQueue1Listener(String msg) {
        System.out.println("消费者接收到fanout.queue1的消息：【" + msg + "】");
    }

    @RabbitListener(queues = "fanout.queue2")
    public void FanoutQueue2Listener(String msg) {
        System.out.println("消费者接收到fanout.queue2的消息：【" + msg + "】");
    }
}
```

<br>

在生产者服务编写以下代码

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSendToFanoutExchange() {
        //交换机名称
        String exchangeName = "itcast.fanout";
        //消息
        String message = "hello,every one!";
        //将消息发送到交换机
        rabbitTemplate.convertAndSend(exchangeName, "", message);
    }
}
```

<br>

###### 2.Direct Exchange

Direct Exchange会将接收到的消息根据规则路由到指定的Queue，因此称为路由模式（routes）

1.每一个Queue都与Exchange设置一个BindingKey

2.发布者发送消息时，指定消息的RoutingKey

3.Exchange将消息路由到BindingKey与消息RoutingKey一致的队列

<br>

代码演示模型图：

![](https://img2.imgtp.com/2024/04/18/lknZXtTu.png)

代码演示：

在消费者服务编写以下代码

```java
@Component
public class SpringRabbitListener {

    //同时声明交换机与队列的绑定关系，并监听队列direct.queue1
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue1"),
            exchange = @Exchange(name = "itcast.direct", type = ExchangeTypes.DIRECT),
            key = {"red", "blue"}
    ))
    public void DirectQueue1Listener(String msg) {
        System.out.println("消费者1接收到direct.queue1的消息：【" + msg + "】");
    }

    //同时声明交换机与队列的绑定关系，并监听队列direct.queue2
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "direct.queue1"),
            exchange = @Exchange(name = "itcast.direct", type = ExchangeTypes.DIRECT),
            key = {"red", "yellow"}
    ))
    public void DirectQueue2Listener(String msg) {
        System.out.println("消费者2接收到direct.queue2的消息：【" + msg + "】");
    }

}
```

<br>

在生产者服务编写以下代码

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSendToDirectExchange() {
        //交换机名称
        String exchangeName = "itcast.direct";
        //消息
        String message = "hello,red!";
        //发送消息
        rabbitTemplate.convertAndSend(exchangeName, "red", message);
    }
}
```

<br>

###### 3.Topic Exchange

TopicExchange与DirectExchange类似，区别在于routingKey必须是多个单词的列表，并且以 **.** 分割

Queue与Exchange指定BindingKey时可以使用通配符：

#：代指0个或多个单词

*：代指一个单词

<br>

代码演示模型图：

![](https://img2.imgtp.com/2024/04/18/lsyMd1Ds.png)

<br>

代码演示：

在消费者服务编写以下代码

```java
@Component
public class SpringRabbitListener {
    
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue1"),
            exchange = @Exchange(name = "itcast.topic", type = ExchangeTypes.TOPIC),
            key = {"china.#"}
    ))
    public void TopicQueue1Listener(String msg) {
        System.out.println("消费者1接收到topic.queue1的消息：【" + msg + "】");
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "topic.queue2"),
            exchange = @Exchange(name = "itcast.topic", type = ExchangeTypes.TOPIC),
            key = {"#.news"}
    ))
    public void TopicQueue2Listener(String msg) {
        System.out.println("消费者2接收到topic.queue2的消息：【" + msg + "】");
    }
}
```

<br>

在生产者服务编写以下代码

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Test
    public void testSendToTopicExchange() {
        //交换机名称
        String exchangeName = "itcast.topic";
        //消息
        String message = "hello,china.news";
        //发送消息
        rabbitTemplate.convertAndSend(exchangeName, "china.news", message);
    }
}
```

<br>

##### 4.消息转换器

Spring对消息对象的处理是由 `org.springframework.amqp.support.converter.MessageConverter`
来处理的。而默认实现是 `SimpleMessageConverter` ，基于JDK的 `ObjectOutputStream` 完成序列化。

上述默认序列化性能较差，因此改用JSON序列化器完成底层实现

代码演示：

在父工程引入依赖

```java
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

<br>

发送消息

在消费者服务中声明一个队列

```java
@Configuration
public class FanoutConfig {
    
    @Bean
    public Queue queue() {
        return new Queue("object.queue");
    }
}
```

<br>

在生产者服务的启动类声明Bean

```java
package cn.itcast.mq;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PublisherApplication {
    public static void main(String[] args) {
        SpringApplication.run(PublisherApplication.class);
    }

    @Bean
    public MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }
}
```

<br>

测试发送消息

```
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAmqpTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testObjectMessage() {
        Map<String, Object> msg = new HashMap<>();
        msg.put("name", "柳岩");
        msg.put("age", 25);
        rabbitTemplate.convertAndSend("object.queue", msg);
    }
}
```

<br>

接收消息

在消费者服务的启动类声明Bean

```java
@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
```

<br>

测试接收消息

```java
@Component
public class SpringRabbitListener {

    @RabbitListener(queues = "object.queue")
    public void ListenObjectQueue(Map<String, Object> msg) {
        System.out.println("消费者接收到object.queue的消息：" + msg);
    }
}
```

<br>

#### MQ高级

> 消息可靠性问题

发送者的可靠性

**生产者重连（即客户端连接MQ失败时进行重连）**

开启重试机制

```yaml
spring:
  rabbitmq:
    connection-timeout: 1s  # 设置MQ的连接超时时间
    template:
      retry:
        enabled: true   # 开启超时重试机制
        initial-interval: 1000ms     # 失败后的初次等待时间
        multiplier: 1     # 失败后的下次等待时长倍数
        max-attempts: 3   # 最大重试次数
```

注意：

SpringAMQP提供的重试机制属于阻塞式的重试，会影响业务性能。如果业务对性能要求较高，建议**禁用**
重试机制。如果一定要使用的话，建议合理配置重试的相关参数，也可以考虑使用**异步线程**去执行发送消息的代码。

<br>

**生产者确认**

RabbitMQ提供两种确认机制：

1. Publisher Confirm
2. Publisher Return

开启确认机制后，MQ会返回确认消息给生成者，告知消息是否发送成功

<br>

返回的情况有以下几种：

1. 消息投递到了MQ，但是路由失败，此时会通过Publisher Return返回路由异常原因，然后返回**ACK**，告知投递成功
2. 非持久化的消息投递到了MQ，并且入队成功，返回**ACK**，告知投递成功
3. 持久化的消息投递到了MQ，并且入队**完成持久化**，返回**ACK**，告知投递成功
4. 其他情况都会返回**NACK**，告知投递失败

<br>

代码实现示例：

1.添加依赖

```yaml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-logging</artifactId>
</dependency>
```

<br>

2.在yml中添加以下配置

```yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated     # 发布者确认机制
    publisher-returns: true   # 发布者返回机制

logging:
  level:
    com.example: debug    # 这里的com.example对应换成自己的包名
```

<br>

3.编写配置类

```java
package com.example.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

/**
 * @author by
 */
@Slf4j
@Configuration
public class MqConfirmConfig implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        RabbitTemplate rabbitTemplate = applicationContext.getBean(RabbitTemplate.class);
        //配置回调
        rabbitTemplate.setReturnsCallback(returned ->
                log.debug("收到消息的return callback，exchange:{},key:{},msg:{},code:{},text:{}",
                        returned.getExchange(), returned.getRoutingKey(), returned.getMessage(),
                        returned.getReplyCode(), returned.getReplyText()));
    }
}
```

<br>

4.Confirm Callback测试代码

```java
@Test
void testConfirmCallback() throws InterruptedException {
    // 1.创建cd
    CorrelationData cd = new CorrelationData(UUID.randomUUID().toString());
    // 2.添加ConfirmCallback
    cd.getFuture().addCallback(new ListenableFutureCallback<CorrelationData.Confirm>() {
        @Override
        public void onFailure(Throwable ex) {
            log.error("消息回调失败", ex);
        }

        @Override
        public void onSuccess(CorrelationData.Confirm result) {
            log.debug("收到confirm callback回执");
            if (result.isAck()) {
                // 消息发送成功
                log.debug("消息发送成功，收到ack");
            } else {
                // 消息发送失败
                log.error("消息发送失败，收到nack，原因：{}", result.getReason());
            }
        }
    });
    rabbitTemplate.convertAndSend("lzh.direct", "red", "hello", cd);
    Thread.sleep(2000);
}
```

<br>

注意：

1. 生产者确认需要额外的网络和系统资源开销，尽量不要使用
2. 如果一定要使用，无需开启 Publisher-Return 机制，因为一般路由失败是自己业务问题
3. 对于nack消息可以有限次数重试，依然失败则记录异常消息

<br>

MQ的可靠性

默认情况下，RabbitMQ会将消息保存在内存中以降低消息收发的延迟，这样会导致两个问题：

1. 一旦MQ宕机，内存中的消息会丢失
2. 内存空间有限，当消费者故障或处理过慢时，会导致消息积压，引发MQ阻塞

<br>

**数据持久化**

三个方面：

1. 交换机持久化
2. 队列持久化
3. 消息持久化

<br>

**Lazy Queue**

Lazy Queue顾名思义，为惰性队列

具有以下特征：

1. 接收到消息后直接存入磁盘而非内存（内存中只保留最近的消息，默认2048条）
2. 消费者要消费消息时才会从磁盘中读取并加载到内存
3. 支持数百万条的消息存储

在3.12版本后，所有的队列都是Lazy Queue模式，无法更改

<br>

消费者的可靠性

**消费者确认机制**

为了确认消费者是否成功处理消息，RabbitMQ提供了消费者确认机制（Consumer Acknowledgement），消费者在对消息处理后会有以下三种返回结果：

1. ack：成功处理消息，RabbitMQ从队列中删除该消息
2. nack：消息处理失败，RabbitMQ需要再次投递消息
3. reject：消息处理失败并拒绝该消息，RabbitMQ从队列中删除该消息

<br>

代码实现：

在yaml中做以下配置：

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: auto     # 自动模式
```

acknowledge-mode有三种参数：

1. none，不处理，消息投递给消费者后，消费者立刻返回ack，然后消息从队列删除

2. manual，手动模式，即自己调用API，发送ack或者reject

3. auto，自动模式，SpringAMQP会根据消费者业务代码执行情况自动返回结果

   有三种返回情况：

    1. 业务代码执行成功，返回ack
    2. 业务异常，返回nack
    3. 消息处理或校验异常，返回reject

<br>

**失败重试机制**

> 为何要有重试机制？

这是因为在开启了确认机制且模式为auto时，消费者在出现异常后，消息会重新入队，然后再发送给消费者，然后再异常，再入队，形成死循环。

<br>

如何开启重试机制？

代码实现：

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true                # 开启消费者失败重试
          initial-interval: 1000ms     # 失败后的初始等待时间
          multiplier: 1                # 失败后的下次等待时长倍数
          max-attempts: 3              # 最大重试次数
          stateless: true              # ture无状态，false有状态，如果业务中包含事务，这里改为false
```

<br>

**失败消息处理策略**

在开启重试机制后，重试次数耗尽，如果消息依然失败，则需要有MessageRecoverer接口来处理，主要包含三种不同的实现：

1. RejectAndDontRequeueRecoverer：重试耗尽后，直接reject，然后丢弃消息，默认这种方式
2. ImmediateRequeueMessageRecoverer：重试耗尽后，返回nack，消息重新入队
3. RepublishMessageRecoverer：重试失败后，将消息投递到指定的交换机

<br>

实现 RepublishMessageRecoverer 代码演示：

编写配置类：

```java
package com.example.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.ImmediateRequeueMessageRecoverer;
import org.springframework.amqp.rabbit.retry.MessageRecoverer;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.rabbit.retry.RepublishMessageRecoverer;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author by
 */
@Configuration
@ConditionalOnProperty(prefix = "spring.rabbitmq.listener.simple", name = "retry.enabled", havingValue = "true")
public class ErrorConfiguration {

    @Bean
    public DirectExchange errorExchange() {
        return new DirectExchange("error.direct");
    }

    @Bean
    public Queue errorQueue() {
        return new Queue("error.queue");
    }

    @Bean
    public Binding errorBinding(DirectExchange errorExchange, Queue errorQueue) {
        return BindingBuilder.bind(errorQueue).to(errorExchange).with("error");
    }

    @Bean
    public MessageRecoverer messageRecoverer(RabbitTemplate rabbitTemplate) {
        return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
    }
}
```

<br>

**业务幂等性**

幂等：在程序开发中，是指同一个业务，执行一次或多次对业务状态的影响是一致的。

实现方案：

1、唯一消息ID

给每一个消息都设置一个唯一ID，利用ID区分是否是相同消息

思路：

1. 每一条消息都生成一个唯一的ID，与消息一起投递给消费者
2. 消费者接收到消息后处理自己的业务，业务处理成功后将消息ID保存到数据库中
3. 如果下次又收到相同消息，去数据库查询判断是否存在，存在则为重复消息放弃处理

<br>

代码实现：

在生产者和消费者的启动类中进行以下配置：

```java
@Bean
public MessageConverter messageConverter() {
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jjmc = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息ID，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jjmc.setCreateMessageIds(true);
    return jjmc;
}
```

<br>

2、业务判断

结合业务逻辑，基于业务本身做判断（不通用）

比如：订单服务接收到消息后，先判断订单状态是否为未支付，如果是则执行更新操作，修改订单状态，如果是其他状态，说明订单已经被修改过了，则直接返回即可

<br>

如果经过上述一系列操作后，消息还是通知失败了，怎么办？

兜底方案：

使用定时任务，让被通知的服务自行去完成操作！！！

<br>

> 延迟消息

延迟消息：生产者发送消息时指定一个时间，消费者不会立刻收到消息，而是在指定时间之后才收到消息

延迟任务：设置在一定时间之后才执行的任务

<br>

**死信交换机**

当一个队列中的消息满足以下情况之一，就称之为**死信**：

1. 消费者使用basic.nack或basic.reject声明消费失败，并且消息的requeue设置为false
2. 消息是一个过期消息，无人消费
3. 要投递的队列消息堆积满了，最早的消息可能成为死信

<br>

如何实现？

图片示例：

![](https://img2.imgtp.com/2024/04/07/o48Ml8tl.png)

思想：

1. 创建两个交换机和两个队列，如图所示
2. simple.queue队列不绑定消费者，设置参数dead-letter-exchange = dlx.direct，即将simple.queue和dlx.direct绑定
3. dlx.queue绑定消费者
4. 生产者发送消息时指定消息的过期时间
5. 当时间在simple.queue停留时间过长且无人消费时，此时消息到达了过期时间，则消息进入dlx.direct，成为死信
6. 死信进入dlx.queue后被消费者消费
7. 最终实现了消息在指定过期时间后才被消费的操作

<br>

**延迟消息插件**

该插件的原理是设计了一种支持延迟消息的交换机，当消息投递到交换机后可以暂存一段时间，到期后再投递到队列

> 如何启动插件？

输入命令

```bash
docker exec -it 容器名称 rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

<br>

代码演示：

1、编写监听器

```java
package com.example.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * @author by
 */
@Component
@Slf4j
public class RabbitListenerTest {

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "delay.queue", durable = "true"),
            exchange = @Exchange(name = "delay.direct", delayed = "true"),
            key = "delay"
    ))
    public void listenDelayMessage(String message) {
        log.info("接收到delay.queue的延迟消息：{}", message);
    }
}
```

<br>

2、编写单元测试

```java
@Test
public void testSendDelayMessage() {
    // 1.创建消息
    String msg = "hello delay message";
    // 2.发送延迟消息，利用消息后置处理器添加消息头
    rabbitTemplate.convertAndSend("delay.direct", "delay", msg, message -> {
        // 添加延迟消息属性
        message.getMessageProperties().setDelay(10000);   // 此处表示10s
        return message;
    });
}
```





