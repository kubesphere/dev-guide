---
title: Webhook外部鉴权
weight: 09
description: "以Webhook的方式完成外部鉴权"
---

KubeSphere 企业版支持设置外部身份验证，平台管理员可以通过 secret（保密字典）配置身份提供者。KubeSphere提供两种不同方式的webhook鉴权，分别为提供密码的外部鉴权方式GenericWebhookIdentityProvider，与跳转外部token提供接口以获取token的鉴权方式OAuthWebhookIdentityProvider。

### 什么是 GenericWebhookIdentityProvider：

GenericWebhookIdentityProvider鉴权是基于webhook实现的身份验证机制，用户输入账号密码后，KubeSphere将信息打包以webhook加密发送给外部鉴权api，外部鉴权api鉴定完成后返回结果并附带唯一id确保用户正确，全程使用加密算法结合一个密钥对请求的主体数据Provider 通过 webhook进行签名计算。

### 什么是 OAuthWebhookIdentityProvider：

OAuthWebhookIdentityProvider鉴权是以 OAuth协议为基础并结合了 webhook 技术的鉴权机制，OAuth 是一种常见的用于授权的开放标准协议，而引入 webhook 后，可以实现一些特定的回调和事件触发机制，用于外部鉴权时可在外部调用ks登录鉴权时进行响应，也具备OAuth的获取用户授权码等信息，然后将这些信息与 webhook 相关数据一起发送给 Provider 进行后续处理


### OAuthWebhookIdentityProvider 配置示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: kubesphere-system
   #name为ks资源注册名称，字母需全小写并以“-”隔开,建议命名方式为provider名称-config
  name: identity-provider-config
  labels:
    config.kubesphere.io/type: identityprovider
stringData:
  configuration.yaml: |
   #name为provider名称，如有版本升级用户导入场景需要与被导入用户labels中名称一致
    name: oauthwebhook
    type: OAuthWebhookIdentityProvider
    mappingMethod: auto
    # 前端登录选项是否隐藏
    hidden : false
    # 是否禁用该登录方式
    disabled: false 
    # 登录方式别名
    displayName: ""
    provider:
        #用于认证的 API 地址
        authURL: "'"
        #用于响应token的API 地址
        tokenURL: ""
        readTimeout: 5000
        insecureSkipVerify: true
        rootCA: ""
        rootCAData: ""
type: config.kubesphere.io/identityprovider
```

### GenericWebhookIdentityProvider 配置示例：
```yaml
apiVersion: v1
kind: Secret
metadata:
  namespace: kubesphere-system
  #name为ks资源注册名称，字母需全小写并以“-”隔开,,建议命名方式为provider名称-config
  name: identity-provider-config
  labels:
    config.kubesphere.io/type: identityprovider
stringData:
  configuration.yaml: |
    #name为provider名称，如有版本升级用户导入场景需要与被导入用户labels中名称一致
    name: generic-webhook
    type: GenericWebhookIdentityProvider 
    mappingMethod: auto
    # 前端登录选项是否隐藏
    hidden : false
    # 是否禁用该登录方式
    disabled: false 
    # 登录方式别名
    displayName: ""
    provider:
        # 用于认证的 API 地址
        authURL: "'"
        readTimeout: 5000
        insecureSkipVerify: true
        rootCA: ""
        rootCAData: ""
type: config.kubesphere.io/identityprovider
```

### 用于认证的 API 规范：


需响应请求，返回用户的关键信息与本次查询结果
GenericWebhookIdentityProvider 对应api:AuthURL应能接受（username, password)，返回连接结果、uid、username、email
OAuthWebhookIdentityProvider 对应api:TokenURL应能接受GET请求发送的URL.token和其他鉴权信息并返回连接结果、uid、username、email。AuthURL应为能获取鉴权token链接，并返回给ks前端

api接口示例：
```go
	r.POST("/authenticate", func(c *gin.Context) {
		var user User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, err)
		}
		userInfo, err := unifieduserplatform.Authenticate(user.Username, user.Password) #外部用户密码鉴权接口调用
		if err != nil {
			c.JSON(http.StatusBadRequest, err) #异常报错
		} else {
			c.JSON(http.StatusOK, gin.H{"uid": strconv.Itoa(userInfo.ID), "username": userInfo.UserName, "email": userInfo.Email}) #结果回传
		}
	})
	r.GET("/oauth/redirect/aiuap", func(c *gin.Context) {
		token := c.Query("token")
		appAcctId := c.Query("appAcctId")
		fmt.Println(token)
		fmt.Println(appAcctId)
		userInfo, err := aiuap.IdentityExchangeCallback(token, appAcctId) #外部tokern接口鉴权调用
		if err != nil {
			c.JSON(http.StatusBadRequest, err) #异常报错
		} else {
			c.JSON(http.StatusOK, gin.H{"uid": userInfo.Id, "username": userInfo.Username, "email": userInfo.Email}) #异常报错
		}
	})
```
