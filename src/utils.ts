import {
    ServiceYear,
    ServiceType,
} from "./types";

import {
    DiscountConfiguration,
    DependencyRulesConfiguration,
} from "./constants";

export const isSelectedServicesStateCompatibleWithDependencies = (
    service: ServiceType,
    selectedServices: ServiceType[],
    dependencyRulesConfig: DependencyRulesConfiguration
): boolean => {
    const dependencyRule = dependencyRulesConfig[service];
    let isCompatible = true;

    if (typeof dependencyRule === "undefined") {
        return isCompatible;
    }

    const dependencyRuleLength = dependencyRule.length;

    for (let i = 0; i < dependencyRuleLength; i++) {
        const rule = dependencyRule[i];

        if (typeof rule === "string") {
            if (!selectedServices.includes(rule)) {
                isCompatible = false;
                break;
            }
        }

        if (Array.isArray(rule)) {
            if (!rule.some((service: ServiceType) => selectedServices.includes(service))) {
                isCompatible = false;
                break;
            }
        }
    };

    return isCompatible;
};

export const getDiscountedServicePrice = (
    service: ServiceType,
    serviceBasePrice: number,
    selectedServices: ServiceType[],
    selectedYear: ServiceYear,
    discountsConfiguration: DiscountConfiguration,
): number => {

    const discountsInSelectedYear = Object.values(discountsConfiguration[selectedYear] || {});

    return discountsInSelectedYear.reduce((lowestServicePrice, discountConfig) => {
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
};
