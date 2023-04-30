import { find, remove, throttle } from 'lodash';
import { calculateDiscount } from '../utils/discounts';
import Dinero from 'dinero.js';

const Money = Dinero

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

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


