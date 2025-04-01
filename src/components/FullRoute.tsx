import { IdType } from "vis-network";
import { Destination } from "./Graph";
import { Leg } from "./RouteTimeline";
import { Line } from "../pages/Home";

// The fullRoute class is used to display the route on the screen
// The Leg[] class is used to display the route in detail with lines classified
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

    for (const [index, fullRoute] of this.route.entries()) {
      if (
        fullRoute.line.lineName.toString() != currentLine.lineName.toString()
      ) {
        // if different line, push the current stations and reset it with the new one
        result.push({ line: currentLine, stations: currentStations });
        currentLine = fullRoute.line;
        currentStations = [
          { node: this.route[index - 1].node, timeElapsed: currentTime },
        ]; // set the current stations to contain the previous value
      }

      // push to current stations
      currentTime += fullRoute.weight;
      currentStations.push({
        node: fullRoute.node,
        timeElapsed: currentTime,
      });
    }

    // add the last result
    result.push({ line: currentLine, stations: currentStations });

    return result;
  }
}
