import { createParamDecorator } from "@nestjs/common";
import { CURRENT_USER } from "src/utils/constants";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: any) => {
    const request = ctx.switchToHttp().getRequest();
    return request[CURRENT_USER];
  },
);