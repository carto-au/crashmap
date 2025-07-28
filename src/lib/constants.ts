import {
  DirectionsBike,
  DirectionsBus,
  DirectionsCar,
  DirectionsWalk,
  LocalShipping,
  Rocket,
  TwoWheeler,
} from "@steeze-ui/material-design-icons";

export enum CrashDegree {
  Fatal = "Fatal",
  Serious = "Serious Injury",
  Moderate = "Moderate Injury",
  Minor = "Minor/Other Injury",
  NonCasualty = "Non-casualty (towaway)",
}

export const CRASH_DEGREES = [
  CrashDegree.Fatal,
  CrashDegree.Serious,
  CrashDegree.Moderate,
  CrashDegree.Minor,
  CrashDegree.NonCasualty,
];

export const DEGREE_COLOR_MAP = {
  [CrashDegree.NonCasualty]: "#868e96", // Gray
  [CrashDegree.Minor]: "#339af0", // Blue
  [CrashDegree.Moderate]: "#fab005", // Yellow
  [CrashDegree.Serious]: "#f76707", // Orange
  [CrashDegree.Fatal]: "#c92a2a", // Red
};

export const DEGREE_SHORTNAME_MAP = {
  [CrashDegree.NonCasualty]: "No casualty",
  [CrashDegree.Minor]: "Minor",
  [CrashDegree.Moderate]: "Moderate",
  [CrashDegree.Serious]: "Serious",
  [CrashDegree.Fatal]: "Fatal",
};

export enum RoadUser {
  Pedestrian = "Pedestrian",
  Bicycle = "Bicycle",
  Motorcycle = "Motorcycle",
  Car = "Car",
  Truck = "Truck",
  Bus = "Bus",
  Other = "Other",
}

export const ROAD_USERS = [
  RoadUser.Pedestrian,
  RoadUser.Bicycle,
  RoadUser.Motorcycle,
  RoadUser.Car,
  RoadUser.Truck,
  RoadUser.Bus,
  RoadUser.Other,
];

export const ROAD_USER_TU_GROUPS_MAP = {
  [RoadUser.Pedestrian]: ["Pedestrian"],
  [RoadUser.Bicycle]: ["Pedal cycle"],
  [RoadUser.Motorcycle]: ["Motorcycle"],
  [RoadUser.Car]: ["Car/car derivative"],
  [RoadUser.Truck]: ["Light truck", "Heavy rigid truck", "Articulated truck"],
  [RoadUser.Bus]: ["Bus"],
  [RoadUser.Other]: [
    "Other or unknown",
    "Other motor vehicle",
    "Non-motorised vehicle",
  ],
};

export const ROAD_USER_ICON_MAP = {
  [RoadUser.Pedestrian]: DirectionsWalk,
  [RoadUser.Bicycle]: DirectionsBike,
  [RoadUser.Motorcycle]: TwoWheeler,
  [RoadUser.Car]: DirectionsCar,
  [RoadUser.Truck]: LocalShipping,
  [RoadUser.Bus]: DirectionsBus,
  [RoadUser.Other]: Rocket,
};

export const ROAD_USER_SHORTNAME_MAP = {
  [RoadUser.Pedestrian]: "Pedestrians",
  [RoadUser.Bicycle]: "Bicycles",
  [RoadUser.Motorcycle]: "Motorbikes",
  [RoadUser.Car]: "Cars/vans/utes",
  [RoadUser.Truck]: "Trucks",
  [RoadUser.Bus]: "Busses",
  [RoadUser.Other]: "Other",
};
