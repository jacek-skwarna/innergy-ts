export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const pricesConfig = {
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

const discountsConfig = {
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

const dependencyRulesConfig = {
    "BlurayPackage": ["VideoRecording"],
    "TwoDayEvent": [["VideoRecording", "Photography"]],
};

const isCompatibleWithDependencies = (service: ServiceType, selectedServices: ServiceType[], dependencyRulesConfig) => {
    const dependencyRule = dependencyRulesConfig[service];
    let isCompatible = true;

    if (typeof dependencyRule === "undefined") {
        return isCompatible;
    }

    const dependencyRuleLength = dependencyRule.length;

    for (let i = 0; i < dependencyRuleLength; i++) {
        const rule = dependencyRule[i];

        if (typeof rule === "string") {
            if (!selectedServices.includes(rule as ServiceType)) {
                isCompatible = false;
                break;
            }
        }

        if (Array.isArray(rule as ServiceType[])) {
            if (!rule.some((service: ServiceType) => selectedServices.includes(service))) {
                isCompatible = false;
                break;
            }
        }
    };

    return isCompatible;
};

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[] = [],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    const {
        type,
        service,
    } = action;

    switch (type) {
        case "Select":
            if (previouslySelectedServices.indexOf(service) >= 0) {
                return previouslySelectedServices;
            }

            if (!isCompatibleWithDependencies(service, previouslySelectedServices, dependencyRulesConfig)) {
                return previouslySelectedServices;
            }

            return [...previouslySelectedServices, service];

        case "Deselect":
            const selectedServicesUniqueArray = [...new Set(previouslySelectedServices)];
            const indexToRemove = selectedServicesUniqueArray.indexOf(service);

            if (indexToRemove < 0) {
                return [...selectedServicesUniqueArray];
            }

            selectedServicesUniqueArray.splice(indexToRemove, 1);

            return selectedServicesUniqueArray.filter((service) => isCompatibleWithDependencies(service, selectedServicesUniqueArray, dependencyRulesConfig));
        default:
            return previouslySelectedServices;
    }
};

export const calculatePrice = (selectedServices: ServiceType[] = [], selectedYear: ServiceYear) => {
    const discountsInSelectedYear = Object.values(discountsConfig[selectedYear] || {});

    const [basePrice, finalPrice] = selectedServices.reduce(([previousBasePrice, previousDiscountedPrice], service) => {
        const serviceBasePrice = pricesConfig[service][selectedYear] || 0;
        const serviceDiscountedPrice = discountsInSelectedYear.reduce((lowestServicePrice, discountConfig) => {
            const {
                discount,
                dependencies,
                service: affectedService,
            } = discountConfig;

            if (service !== affectedService) {
                return lowestServicePrice;
            }

            const isDiscountApplicable = dependencies.every((item: ServiceType) => selectedServices.includes(item));

            if (!isDiscountApplicable) {
                return lowestServicePrice;
            }

            const discountedServicePrice = serviceBasePrice - discount;

            return discountedServicePrice < lowestServicePrice ? discountedServicePrice : lowestServicePrice;
        }, serviceBasePrice);

        return [(previousBasePrice + serviceBasePrice), (previousDiscountedPrice + serviceDiscountedPrice)];
    }, [0, 0]);
    
    return ({ basePrice, finalPrice });
};