import { readdir, stat } from "fs/promises";
import { extname, join } from "path";
import { Router } from "express";

export class V1RoutesRegistry {
  private readonly routes: Router = Router();

  public register(featureRouter: Router): void {
    this.routes.use(featureRouter);
  }

  public getRoutes(): Router {
    return this.routes;
  }

  public async autoLoadRoutesAsync(): Promise<void> {
    const routesDir = __dirname;
    const ignoredFile = __filename;
    await this.recursiveRouteLoader(routesDir, ignoredFile);
  }

  private async importFile(fullPath: string, file: string): Promise<void> {
    const fileExtensions = [".ts", ".js"];
    const isRouteFile = fileExtensions.includes(extname(file));

    if (isRouteFile && !file.endsWith(".d.ts")) {
      try {
        await import(fullPath);
      } catch (err) {
        console.error(`Failed to load route ${file}:`, err);
      }
    }
  }

  private async recursiveRouteLoader(
    dir: string,
    ignoreFullPath: string
  ): Promise<void> {
    const files = await readdir(dir);
    const importPromises: Promise<void>[] = [];

    for (const file of files) {
      const fullPath = join(dir, file);
      const fileStats = await stat(fullPath);

      if (fullPath === ignoreFullPath) continue;

      if (fileStats.isDirectory()) {
        importPromises.push(
          this.recursiveRouteLoader(fullPath, ignoreFullPath)
        );
      } else if (fileStats.isFile()) {
        importPromises.push(this.importFile(fullPath, file));
      }
    }

    await Promise.all(importPromises);
  }
}
