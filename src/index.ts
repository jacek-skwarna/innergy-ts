import {
    ServiceYear,
    ServiceType,
} from "./types";

import {
    pricesConfig,
    discountsConfig,
    DiscountConfiguration,
    dependencyRulesConfig,
    PriceConfiguration,
} from "./constants";

import {
    isSelectedServicesStateCompatibleWithDependencies,
    getDiscountedServicePrice,
} from "./utils";

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

            if (!isSelectedServicesStateCompatibleWithDependencies(service, previouslySelectedServices, dependencyRulesConfig)) {
                return previouslySelectedServices;
            }

            return [...previouslySelectedServices, service];

        case "Deselect":
            const selectedServicesUniqueArray = [...new Set(previouslySelectedServices)];
            const indexToRemove = selectedServicesUniqueArray.indexOf(service);

            if (indexToRemove < 0) {
                return selectedServicesUniqueArray;
            }

            selectedServicesUniqueArray.splice(indexToRemove, 1);

            return selectedServicesUniqueArray.filter((service) => isSelectedServicesStateCompatibleWithDependencies(service, selectedServicesUniqueArray, dependencyRulesConfig));
        default:
            return previouslySelectedServices;
    }
};

export const calculatePrice = (
    selectedServices: ServiceType[] = [],
    selectedYear: ServiceYear,
    pricesConfiguration: PriceConfiguration = pricesConfig,
    discountsConfiguration: DiscountConfiguration = discountsConfig,
): { basePrice: number, finalPrice: number } => {

    const [basePrice, finalPrice] = selectedServices.reduce(([previousBasePrice, previousDiscountedPrice], service) => {
        const serviceBasePrice = pricesConfiguration[service][selectedYear] || 0;
        const serviceDiscountedPrice = getDiscountedServicePrice(service, serviceBasePrice, selectedServices, selectedYear, discountsConfiguration);

        return [(previousBasePrice + serviceBasePrice), (previousDiscountedPrice + serviceDiscountedPrice)];
    }, [0, 0]);
    
    return ({ basePrice, finalPrice });
};
