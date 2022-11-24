export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const dependencyRulesConfig = {
    "BlurayPackage": ["VideoRecording"],
    "TwoDayEvent": [["WeddingSession", "Photography"]],
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

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => ({ basePrice: 0, finalPrice: 0 });