import { IdType } from "vis-network";
import { Destination } from "./Graph";
import { Leg } from "./RouteTimeline";
import { Line } from "../pages/Home";

export class FullRoute {
  private start: IdType;
  private route: Destination[];

  constructor(start: IdType, route: Destination[]) {
    this.start = start;
    this.route = route;
  }

  getStart(): IdType {
    return this.start;
  }
  getRoute(): Destination[] {
    return this.route;
  }

  // convert a fullroute object to a list of lege
  fullRouteToLegs(): Leg[] {
    let result: Leg[] = [];
    let currentLine: Line = this.route[0].line;
    let currentStations: { node: IdType; timeElapsed: number }[] = [];
    let currentTime: number = 0;

    // add the start station
    currentStations.push({ node: this.start, timeElapsed: currentTime });

    for (const fullRoute of this.route) {
      currentTime += fullRoute.weight;
      if (fullRoute.line != currentLine) {
        // if different line, push the current stations and reset it with the new one
        result.push({ line: fullRoute.line, stations: currentStations });
        currentLine = fullRoute.line;
        currentStations = [{ node: fullRoute.node, timeElapsed: currentTime }];
      } else {
        // push to current stations
        currentStations = [{ node: fullRoute.node, timeElapsed: currentTime }];
      }
    }

    // add the last result
    result.push({ line: currentLine, stations: currentStations });

    return result;
  }
}
