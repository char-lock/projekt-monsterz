import { Injectable, OnDestroy } from "@angular/core";
import { PrismaClient } from "@prisma/client";

/**
 * Angular Service for handling generic database requests.
 */

@Injectable()
export class DataBusService implements OnDestroy {
  prisma: PrismaClient;

  ngOnInit() {
    this.prisma = new PrismaClient();
  }

  async ngOnDestroy() {
    await this.prisma.$disconnect();
  }
}
