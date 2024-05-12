---
title: 简易sdk开发和使用
createTime: 2024/05/09 14:33:00
author: 路白榆
tags:
  - SDK
  - 工具包
permalink: /article/t78u23lt/
---

### 开发简易版SDK

代码示例：

1.创建SpringBoot项目，引入以下依赖

```xml

<dependencies>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>5.8.16</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

<br>

2.删除pom.xml中的以下依赖

```xml

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>${spring-boot.version}</version>
            <configuration>
                <mainClass>com.lzh.project.LuapiInterfaceApplication</mainClass>
                <skip>true</skip>
            </configuration>
            <executions>
                <execution>
                    <id>repackage</id>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

<br>

3.创建实体类（仅作示例）

```java
import lombok.Data;

@Data
public class User {

    private String name;
}
```

<br>

4.创建工具类（仅作示例）

```java
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;

/**
 * 签名工具类
 */
public class SignUtil {

    public static String generateSign(String body, String secretKey) {
        String newSecret = body + "-" + secretKey;
        Digester digester = new Digester(DigestAlgorithm.SHA256);
        return digester.digestHex(newSecret);
    }
}
```

<br>

5.创建客户端类（仅作示例）

```java
import cn.hutool.core.util.RandomUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import com.lzh.sdk.model.User;
import com.lzh.sdk.utils.SignUtil;

import java.util.HashMap;
import java.util.Map;

public class LuApiClient {

    //签名标识
    private String accessKey;
    //密钥
    private String secretKey;

    public LuApiClient(String accessKey, String secretKey) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    public String getNameByGet(String name) {
        //可以单独传入http参数，这样参数会自动做URL编码，拼接在URL中
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("name", name);
        return HttpUtil.get("http://localhost:8123/api/name/", paramMap);
    }

    public String getNameByPost(String name) {
        //可以单独传入http参数，这样参数会自动做URL编码，拼接在URL中
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("name", name);
        return HttpUtil.post("http://localhost:8123/api/name/", paramMap);
    }

    public String getNameByPost2(User user) {
        String jsonStr = JSONUtil.toJsonStr(user);
        HttpRequest httpRequest = HttpRequest.post("http://localhost:8123/api/name/json")
                .body(jsonStr)
                .addHeaders(getHeaderMap(jsonStr));
        return httpRequest.execute().body();
    }


    public Map<String, String> getHeaderMap(String body) {
        Map<String, String> map = new HashMap<>();
        //签名标识
        map.put("accessKey", accessKey);
        //随机数
        map.put("nonce", RandomUtil.randomNumbers(4));
        //时间戳
        map.put("timestamp", String.valueOf(System.currentTimeMillis() / 1000));
        //请求参数
        map.put("body", body);
        //密钥加密
        map.put("sign", SignUtil.generateSign(body, secretKey));
        return map;
    }
}
```

<br>

6.创建核心配置类

```java
import com.lzh.sdk.client.LuApiClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("luapi.client")     //定义yml文件配置前缀
@Data
@ComponentScan
public class LuApiSdkConfig {

    private String accessKey;
    private String secretKey;

    @Bean
    public LuApiClient luApiClient() {
        return new LuApiClient(accessKey, secretKey);
    }
}
```

<br>

7.在resources目录下创建META-INF目录，在该目录下创建spring.factories文件，编写以下配置

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.lzh.sdk.config.LuApiSdkConfig
```

<br>

8.删除main下的启动类和test下的启动类

9.点击maven下的生命周期的install

10.开发完成，install后该依赖包下载到本地仓库

<br>

### 使用简易版SDK

1.引入依赖

```xml

<dependency>
    <groupId>com.lzh</groupId>
    <artifactId>luapi-client-sdk</artifactId>
    <version>0.0.1</version>
</dependency>
```

<br>

2.配置yml文件

```yaml
luapi:
  client:
    access-key: baiyu
    secret-key: abcdef
```

<br>

3.编写测试类

```java
import com.lzh.sdk.client.LuApiClient;
import com.lzh.sdk.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
class LuapiInterfaceApplicationTests {

    @Resource
    private LuApiClient luApiClient;

    @Test
    void contextLoads() {
        User user = new User();
        user.setName("baiyu");
        String res = luApiClient.getNameByPost2(user);
        System.out.println(res);
    }
}
```


