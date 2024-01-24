export const customerIsFTTH = (customer) => {

    if (!customer.plan) return false;

    return customer.plan.toUpperCase().includes('FTTH');
};