// Enhanced Role Service

const ROLES_KEY = 'ab_roles_v2'; // Must match rolePermissionService key

const getRoles = () => {
  return JSON.parse(localStorage.getItem(ROLES_KEY) || '[]');
};

const saveRoles = (roles) => {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

export const getAllRoles = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const roles = getRoles();
  
  // Ensure we return at least default if empty (though service initialization handles this usually)
  if (roles.length === 0) {
      const defaultRoles = [
          { id: 'role-super-admin', name: 'Super Admin', description: 'Full system access', is_default: true },
          { id: 'role-manager', name: 'Manager', description: 'Management access', is_default: true },
          { id: 'role-employee', name: 'Employee', description: 'Standard employee access', is_default: true }
      ];
      saveRoles(defaultRoles);
      return defaultRoles;
  }
  return roles;
};

export const createRole = async (roleData) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const roles = getRoles();
  
  const newRole = {
    id: `role-${Date.now()}`,
    name: roleData.name,
    description: roleData.description || '',
    is_default: false,
    createdAt: new Date().toISOString()
  };
  
  roles.push(newRole);
  saveRoles(roles);
  return newRole;
};

export const deleteRole = async (roleId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const roles = getRoles();
  
  const roleToDelete = roles.find(r => r.id === roleId);
  if (!roleToDelete) {
    throw new Error('Role not found');
  }
  
  if (roleToDelete.is_default) {
    throw new Error('Cannot delete system default roles');
  }
  
  const updatedRoles = roles.filter(r => r.id !== roleId);
  saveRoles(updatedRoles);
  return true;
};