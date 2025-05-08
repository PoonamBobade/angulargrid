import { Injectable } from "@angular/core";
import { GridSettings } from "./grid-settings.interface";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

@Injectable({
  providedIn: 'root',
})
export class StatePersistingService {
  public get<T>(token: string): T | null {
    const settings = localStorage.getItem(token);
    try {
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("Error parsing saved preferences:", error);
      return null;
    }
  }

  public set<T>(token: string, gridConfig: GridSettings): void {
    try {
      localStorage.setItem(
        token,
        JSON.stringify(gridConfig, getCircularReplacer())
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }
}
