import { Controller } from '@nestjs/common';
import { UserRoleService } from '../services/user-role.service';

@Controller({
  path: 'user-roles',
  version: '1',
})
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}
}
