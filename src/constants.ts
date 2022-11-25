import {
    ServiceYear,
    ServiceType,
} from "./types";

type PriceInYear = Record<ServiceYear, number>;
export type PriceConfiguration = Record<ServiceType, PriceInYear>;

type Discount = {
    dependencies: ServiceType[],
    discount: number,
    service: ServiceType,
};
type DiscountConfigurationEntry = Record<string, Discount>;
export type DiscountConfiguration = Record<ServiceYear, DiscountConfigurationEntry>;

type DependencyRule = ServiceType[] | ServiceType[][];
export type DependencyRulesConfiguration = Partial<Record<ServiceType, DependencyRule>>;

export const pricesConfig: PriceConfiguration = {
    "Photography": {
        2020: 1700,
        2021: 1800,
        2022: 1900,
    },
    "VideoRecording": {
        2020: 1700,
        2021: 1800,
        2022: 1900,
    },
    "BlurayPackage": {
        2020: 300,
        2021: 300,
        2022: 300,
    },
    "TwoDayEvent": {
        2020: 400,
        2021: 400,
        2022: 400,
    },
    "WeddingSession": {
        2020: 600,
        2021: 600,
        2022: 600,
    },
};

export const discountsConfig: DiscountConfiguration = {
    2020: {
        "package photography and video": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 600,
            service: "Photography",
        },
        "package video and photography": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 600,
            service: "VideoRecording",
        },
        "package session and photography": {
            dependencies: ["WeddingSession", "Photography"],
            discount: 300,
            service: "WeddingSession",
        },
        "package session and video": {
            dependencies: ["WeddingSession", "VideoRecording"],
            discount: 300,
            service: "WeddingSession",
        },
    },
    2021: {
        "package photography and video": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 650,
            service: "Photography",
        },
        "package video and photography": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 650,
            service: "VideoRecording",
        },
        "package session and photography": {
            dependencies: ["WeddingSession", "Photography"],
            discount: 300,
            service: "WeddingSession",
        },
        "package session and video": {
            dependencies: ["WeddingSession", "VideoRecording"],
            discount: 300,
            service: "WeddingSession",
        },
    },
    2022: {
        "package photography and video": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 650,
            service: "Photography",
        },
        "package video and photography": {
            dependencies: ["Photography", "VideoRecording"],
            discount: 650,
            service: "VideoRecording",
        },
        "package session and video": {
            dependencies: ["WeddingSession", "VideoRecording"],
            discount: 300,
            service: "WeddingSession",
        },
        "package session and photography": {
            dependencies: ["WeddingSession", "Photography"],
            discount: 600,
            service: "WeddingSession",
        },
    },
};

export const dependencyRulesConfig: DependencyRulesConfiguration = {
    BlurayPackage: ["VideoRecording"],
    TwoDayEvent: [["VideoRecording", "Photography"]],
};
