enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

enum Permission {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete'
}

const rolePermissions = {
  [Role.Admin]: [
    Permission.Get,
    Permission.Post,
    Permission.Put,
    Permission.Delete
  ],
  [Role.User]: [Permission.Get, Permission.Post],
  [Role.Guest]: [Permission.Get]
};
