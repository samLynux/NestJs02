import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AppDummy{
    public dummy(): string {
        return `dumb`;
      }
}