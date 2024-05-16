---
title: 图片上传获取
createTime: 2024/05/16 14:54:00
author: 路白榆
tags:
  - 图片上传
  - 显示图片
permalink: /article/vqy9r8u4/
---

### 图片上传获取

#### 上传图片

1.在application.yml文件进行配置

```yaml
byapi:
  server:
    path:
      #指定图片请求前缀
      domain: http://localhost:9000/api
      #指定图片保存地址
      address: D:\idea\project\byapi-backend\byapi-server\src\main\resources\images
```

<br>

2.示例代码

```java
@PostMapping("/upload/avatar")
@LoginCheck
public Result<String> uploadAvatar(MultipartFile multipartFile) {
    if (multipartFile == null) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR);
    }
    String imageUrl = userService.uploadAvatar(multipartFile);
    return Result.success(imageUrl);
}
```

```java
@Value("${byapi.server.path.domain}")
private String domain;
@Value("${byapi.server.path.address}")
private String address;


@Override
public String uploadAvatar(MultipartFile multipartFile) {
    //判断文件名是否为空
    String originalFilename = multipartFile.getOriginalFilename();
    if (StrUtil.isBlank(originalFilename)) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR);
    }
    //判断图片后缀是否存在
    String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
    if (StrUtil.isBlank(suffix)) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR, CommonConsts.IMAGE_FORMAT_ERROR);
    }
    //生成随机文件名
    String newFileName = UUID.randomUUID().toString().replace("-", "") + suffix;
    //上传图片
    File dest = new File(address + "/" + newFileName);
    try {
        multipartFile.transferTo(dest);
    } catch (Exception e) {
        log.error("图片上传失败", e);
        throw new BusinessException(ErrorCode.PARAMS_ERROR, CommonConsts.IMAGE_UPLOAD_ERROR);
    }
    //获取并返回图片请求路径
    return domain + "/user/get/avatar/" + newFileName;
}
```

<br>

#### 获取图片

示例代码

**！！！注意获取图片的请求路径需与上传图片后返回的图片路径一致**

```java
@GetMapping("/get/avatar/{fileName}")
@LoginCheck
public void getAvatar(@PathVariable String fileName, HttpServletResponse response) {
    if (StrUtil.isBlank(fileName) || response == null) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR);
    }
    userService.getAvatar(fileName, response);
}
```

```java
@Override
public void getAvatar(String fileName, HttpServletResponse response) {
    //获取文件后缀
    String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
    //获取图片存放路径
    String url = address + "/" + fileName;
    //响应图片
    response.setContentType("image/" + suffix);
    //从服务器中读取图片
    try (
            //获取输出流
            OutputStream outputStream = response.getOutputStream();
            //获取输入流
            FileInputStream fileInputStream = new FileInputStream(url)
    ) {
        byte[] buffer = new byte[1024];
        int b;
        while ((b = fileInputStream.read(buffer)) != -1) {
            //将图片以字节流形式写入输出流
            outputStream.write(buffer, 0, b);
        }
    } catch (IOException e) {
        log.error("文件读取失败", e);
        throw new BusinessException(ErrorCode.PARAMS_ERROR, CommonConsts.IMAGE_READ_ERROR);
    }
}
```

