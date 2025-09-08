# 权限管理系统文档

## 概述

本系统实现了一个完整的基于角色的权限控制（RBAC）系统，支持用户、角色、权限的精细化管理。

## 系统架构

### 数据模型

- **用户 (tb_user)**: 存储用户基本信息
- **角色 (tb_role)**: 定义角色类型
- **权限 (tb_permission)**: 定义具体权限
- **用户角色关联 (tb_user_role)**: 用户与角色的多对多关系
- **角色权限关联 (tb_role_permission)**: 角色与权限的多对多关系

### 权限设计

权限采用 `操作:资源` 的命名规范：
- `read:users` - 查看用户
- `write:users` - 管理用户
- `read:roles` - 查看角色
- `write:roles` - 管理角色
- `read:permissions` - 查看权限
- `write:permissions` - 管理权限
- `read:articles` - 查看文章
- `write:articles` - 管理文章
- `admin:system` - 系统管理

## 功能特性

### 1. 权限管理
- 权限的增删改查
- 权限类型自动识别（read/write/admin/other）
- 权限名称唯一性验证
- 删除前检查是否被角色使用

### 2. 角色管理
- 角色的增删改查
- 角色权限分配
- 权限分配可视化界面
- 角色权限批量更新

### 3. 用户管理
- 用户基本信息管理
- 用户角色分配
- 用户权限展示（通过角色继承）
- 用户权限标签显示

### 4. 权限验证
- API 接口权限验证中间件
- 前端组件权限保护
- 权限检查工具函数
- 角色检查工具函数

## 使用方法

### 1. 初始化系统

```bash
# 调用初始化接口
POST /api/init
```

这将创建：
- 9个基础权限
- admin 角色（拥有所有权限）
- guest 角色（只有读取权限）
- 管理员用户（phone: 15160315110, password: 123456）
- 普通用户（phone: 13800138000, password: 123456）

### 2. 前端权限检查

#### 使用 usePermission Hook

```typescript
import { usePermission } from '@/app/hooks/usePermission'

function MyComponent() {
  const { hasPermission, hasRole, isAdmin, canAccess } = usePermission()
  
  if (hasPermission('read:users')) {
    // 显示用户列表
  }
  
  if (isAdmin()) {
    // 显示管理员功能
  }
  
  if (canAccess(['read:users', 'write:users'])) {
    // 用户有任一权限时显示
  }
}
```

#### 使用权限保护组件

```typescript
import { WithPermission, AdminOnly, WithRole } from '@/app/components/PermissionGuard'

function MyComponent() {
  return (
    <div>
      {/* 需要特定权限 */}
      <WithPermission permission="write:users" fallback={<div>需要用户管理权限</div>}>
        <Button>编辑用户</Button>
      </WithPermission>
      
      {/* 需要管理员权限 */}
      <AdminOnly fallback={<div>需要管理员权限</div>}>
        <Button>删除所有数据</Button>
      </AdminOnly>
      
      {/* 需要特定角色 */}
      <WithRole role="admin" fallback={<div>需要管理员角色</div>}>
        <Button>系统设置</Button>
      </WithRole>
    </div>
  )
}
```

### 3. API 权限验证

#### 使用权限验证中间件

```typescript
import { withPermission, withRole, withAdmin } from '@/app/middleware/auth'

// 需要特定权限
export const POST = withPermission('write:users')(async (request, user) => {
  // 处理请求，user 参数包含当前用户信息
})

// 需要特定角色
export const POST = withRole('admin')(async (request, user) => {
  // 处理请求
})

// 需要管理员权限
export const POST = withAdmin(async (request, user) => {
  // 处理请求
})
```

#### 手动权限检查

```typescript
import { verifyAuth, hasPermission, hasRole } from '@/app/middleware/auth'

export async function POST(request: NextRequest) {
  const { user, error } = await verifyAuth(request)
  
  if (!user) {
    return NextResponse.json({ success: false, message: '认证失败' }, { status: 401 })
  }
  
  if (!hasPermission(user, 'write:users')) {
    return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 })
  }
  
  // 处理请求
}
```

## API 接口

### 权限管理

- `POST /api/permissions/list` - 获取权限列表
- `POST /api/permissions/create` - 创建权限
- `POST /api/permissions/update` - 更新权限
- `POST /api/permissions/delete` - 删除权限

### 角色管理

- `POST /api/roles/list` - 获取角色列表
- `POST /api/roles/create` - 创建角色
- `POST /api/roles/update` - 更新角色
- `POST /api/roles/delete` - 删除角色
- `GET /api/roles/permissions?roleId=1` - 获取角色权限
- `POST /api/roles/permissions` - 分配角色权限

### 用户管理

- `POST /api/users/list` - 获取用户列表
- `POST /api/users/create` - 创建用户
- `POST /api/users/update` - 更新用户
- `POST /api/users/delete` - 删除用户

## 页面功能

### 权限管理页面
- 权限列表展示
- 权限搜索功能
- 权限增删改查
- 权限类型标签显示

### 角色管理页面
- 角色列表展示
- 角色权限分配
- 权限分配弹窗
- 角色权限展示

### 用户管理页面
- 用户列表展示
- 用户权限展示
- 用户角色管理
- 权限标签显示

### 权限演示页面
- 权限系统功能演示
- 使用示例展示
- 权限检查结果展示

## 安全特性

1. **API 权限验证**: 所有敏感操作都需要权限验证
2. **前端权限保护**: UI 组件根据权限显示/隐藏
3. **权限继承**: 用户通过角色继承权限
4. **权限隔离**: 不同角色只能访问授权资源
5. **操作审计**: 所有操作都有日志记录

## 扩展指南

### 添加新权限

1. 在权限管理页面添加新权限
2. 在角色管理页面分配给相应角色
3. 在代码中使用权限检查

### 添加新角色

1. 在角色管理页面创建新角色
2. 分配相应权限给角色
3. 将角色分配给用户

### 自定义权限验证

```typescript
// 自定义权限验证逻辑
function customPermissionCheck(user: AuthUser, resource: string, action: string): boolean {
  // 自定义验证逻辑
  return true
}
```

## 注意事项

1. 权限名称必须唯一
2. 删除权限前需要检查是否被角色使用
3. 管理员角色拥有所有权限
4. 权限验证失败会返回 403 状态码
5. 未认证用户会返回 401 状态码

## 故障排除

### 常见问题

1. **权限验证失败**: 检查用户是否有所需权限
2. **角色权限不生效**: 检查角色权限分配是否正确
3. **API 返回 401**: 检查认证令牌是否正确
4. **API 返回 403**: 检查用户权限是否足够

### 调试方法

1. 使用权限演示页面查看当前用户权限
2. 检查浏览器控制台错误信息
3. 查看服务器日志
4. 使用权限检查工具函数

## 更新日志

- v1.0.0: 初始版本，基础权限管理功能
- v1.1.0: 添加权限验证中间件
- v1.2.0: 添加权限保护组件
- v1.3.0: 完善用户体验和错误处理
