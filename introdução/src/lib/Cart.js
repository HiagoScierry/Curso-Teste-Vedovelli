import { find, remove, throttle } from 'lodash';
import Dinero from 'dinero.js';

const Money = Dinero

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { condition, quantity }) => {
    if (condition?.percentage && quantity > condition.minimum) {
        return amount.percentage(condition.percentage);
    };
    return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { quantity, condition }) => {
    const isEven = quantity % 2 === 0;

    if (condition?.quantity && quantity > condition.quantity) {
        return amount.percentage(isEven ? 50 : 40);
    };
    return Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
    const list = Array.isArray(condition) ? condition : [condition];

    const [higherDiscount] = list.map((cond) => {
        if (cond.percentage) {
            return calculatePercentageDiscount(amount, { quantity, condition: cond }).getAmount();
        } else if (cond.quantity) {
            return calculateQuantityDiscount(amount, { quantity, condition: cond }).getAmount();
        }
    }).sort((a, b) => b - a);

    return Money({ amount: higherDiscount });

}


export default class Cart {
    items = [];

    getTotal() {
        return this.items.reduce((acc, { quantity, product, condition }) => {
            const amount = Money({ amount: product.price * quantity });
            let discount = Money({ amount: 0 });

            if (condition) {
                discount = calculateDiscount(amount, quantity, condition);
            }

            return acc.add(amount).subtract(discount);

        }, Money({ amount: 0 }));

    }

    add(item) {
        const itemToFind = { product: item.product };

        if (find(this.items, itemToFind)) {
            remove(this.items, itemToFind);
        }

        this.items.push(item);
    }

    remove(product) {
        remove(this.items, { product });
    }

    summary() {
        const total = this.getTotal();
        const formatted = total.toFormat('$0,0.00');
        const items = this.items;


        return {
            total,
            formatted,
            items,
        };
    }

    checkout() {
        const { total, items } = this.summary();

        this.items = [];

        return {
            total,
            items,
        };

    }
}


