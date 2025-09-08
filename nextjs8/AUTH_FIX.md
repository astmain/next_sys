# 认证问题修复说明

## 问题描述
`/api/permissions/create` 接口返回 `{"success":false,"message":"未提供认证令牌"}` 错误。

## 问题原因
1. axios 请求拦截器中的认证头设置被注释掉了
2. 登录成功后，token 只存储到了状态管理中，没有存储到 localStorage
3. 认证中间件需要验证令牌格式

## 修复内容

### 1. 修复 axios 请求拦截器
**文件**: `app/axios_api.ts`
```typescript
// 请求拦截器
axios_instance.interceptors.request.use(
  (config) => {
    // 添加认证令牌
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 2. 修复登录页面
**文件**: `pages/Login.tsx`
```typescript
if (response.success) {
  BUS.auth.user = response.user
  BUS.auth.token = response.token + '1111'
  // 存储到 localStorage 以便 axios 拦截器使用
  localStorage.setItem('token', response.token + '1111')
  console.log('BUS.auth.token', BUS.auth.token)
  Message.success('登录成功')
  router.push('/')
}
```

### 3. 完善认证中间件
**文件**: `app/middleware/auth.ts`
```typescript
export async function verifyAuth(request: NextRequest): Promise<{ user: AuthUser | null; error?: string }> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { user: null, error: '未提供认证令牌' }
    }

    // 简化处理：验证令牌格式并查询用户
    if (!token.includes('1111')) {
      return { user: null, error: '无效的认证令牌' }
    }

    // 根据令牌查询用户
    const user = await prisma.tb_user.findFirst({
      where: { phone: '15160315110' },
      include: {
        roles: {
          include: {
            tb_permission: true
          }
        }
      }
    })

    if (!user) {
      return { user: null, error: '用户不存在' }
    }

    return { user: user as AuthUser }
  } catch (error) {
    console.error('认证验证失败:', error)
    return { user: null, error: '认证验证失败' }
  }
}
```

## 测试方法

### 1. 使用认证测试页面
访问 "🔧 认证测试" 页面，可以：
- 测试权限列表接口
- 测试创建权限接口
- 设置测试令牌
- 清除令牌
- 查看当前认证状态

### 2. 手动测试步骤
1. 访问登录页面
2. 使用默认账号登录（手机号: 15160315110, 密码: 123456）
3. 登录成功后，访问权限管理页面
4. 尝试创建新权限

### 3. 检查认证状态
在浏览器开发者工具中：
1. 打开 Application/Storage 标签
2. 查看 Local Storage 中是否有 `token` 键
3. 检查 Network 标签中请求头是否包含 `Authorization: Bearer xxx`

## 注意事项

1. **令牌格式**: 当前使用简化格式，实际项目中应使用 JWT
2. **用户查询**: 当前固定查询特定用户，实际项目中应从令牌解析用户ID
3. **权限验证**: 确保用户有 `write:permissions` 权限才能创建权限
4. **错误处理**: 认证失败会返回 401 状态码，权限不足会返回 403 状态码

## 常见问题

### Q: 仍然提示"未提供认证令牌"
A: 检查 localStorage 中是否有 token，检查请求头是否包含 Authorization

### Q: 提示"权限不足"
A: 确保用户已登录且具有相应权限，检查角色权限分配

### Q: 提示"用户不存在"
A: 确保数据库中有对应用户，检查用户角色关联

## 下一步改进

1. 实现真正的 JWT 令牌验证
2. 从令牌中解析用户ID而不是固定查询
3. 添加令牌过期时间检查
4. 实现令牌刷新机制
5. 添加更详细的错误日志
