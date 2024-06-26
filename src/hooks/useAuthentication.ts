'use client';
import { useEffect, useState } from 'react';

// Dicebear imports
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import type { User } from '@/types/dicebear/user';
import type { Role } from '@/types/dicebear/role';
import type { AuthenticationHookResult } from '@/types/authTypes/authHookResult';

export const useAuthentication = (): AuthenticationHookResult => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const user: User = JSON.parse(userJson);

      const avatar = createAvatar(thumbs, {
        size: 64,
        seed: user.name ?? ''
      }).toDataUriSync();

      user.profile_pic = avatar;

      setUserInfo(user);

      if (user.roles) {
        const roles: Role[] = user.roles;
        setUserRoles(roles.map((item) => item.name));
      }
    }
  }, []);

  return {
    userInfo,
    userRoles
  };
};
