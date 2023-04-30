import Cart from "./Cart";


describe("Cart", () => {
    let cart;
    let product = {
        title: "Adidas shoes",
        price: 35388, // 353.88
    };

    let product2 = {
        title: "Red hat",
        price: 10000,
    };


    beforeEach(() => {
        cart = new Cart();
    });


    describe("getTotal", () => {
        it("Should return 0 when getTotal() is executed in a newly created instance", () => {
            expect(cart.getTotal().getAmount()).toBe(0);
        });

        it("Should multiply quantity and price and receive the total amount", () => {
            const item = {
                product,
                quantity: 2,
            };

            cart.add(item);

            expect(cart.getTotal().getAmount()).toBe(70776);
        });

        it("Should ensure no more than on product exists at a time", () => {
            cart.add({
                product,
                quantity: 2,
            });
            cart.add({
                product,
                quantity: 1,
            });

            expect(cart.getTotal().getAmount()).toBe(35388);
        });

        it("Should update total when a product gets included and then removed from cart", () => {
            cart.add({
                product,
                quantity: 2,
            });
            cart.add({
                product: product2,
                quantity: 1,
            });

            cart.remove(product);

            expect(cart.getTotal().getAmount()).toBe(10000);
        });
    });

    describe("checkout()", () => {
        it('should return an object with the total and the list of items', () => {
            cart.add({
                product,
                quantity: 5,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });

            expect(cart.checkout()).toMatchSnapshot();
        });

        it('should return an object with the total and the list of items when summary() is called ', () => {
            cart.add({
                product,
                quantity: 5,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });

            expect(cart.summary()).toMatchSnapshot();
            expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
        });


        it('should include formatted amount in the summary', () => {
            cart.add({
                product,
                quantity: 5,
            });

            cart.add({
                product: product2,
                quantity: 3,
            });


            expect(cart.summary().formatted).toBe("R$2,069.40");

        });

        it('should reset the cart when checkout() is called', () => {
            cart.add({
                product: product2,
                quantity: 3,
            });

            cart.checkout();

            expect(cart.getTotal().getAmount()).toEqual(0);
        });

    });

    describe("special conditions", () => {

        it('should apply percentage discount quantity above minimum is passed', () => {
            const condition = {
                percentage: 30,
                minimum: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 3,
            });

            expect(cart.getTotal().getAmount()).toEqual(74315);
        });

        it('should NOT apply percentage discount quantity is below or equals minumum', () => {
            const condition = {
                percentage: 30,
                minimum: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 2,
            });

            expect(cart.getTotal().getAmount()).toEqual(70776);
        });

        it('should apply quantity discount for even quantities', () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 4,
            });

            expect(cart.getTotal().getAmount()).toEqual(70776);
        });

        it('should NOT apply quantity discount for even quantities when condition is not met', () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 1,
            });

            expect(cart.getTotal().getAmount()).toEqual(35388);
        });

        it("should apply quantity discount for even quantities", () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 4,
            });

            expect(cart.getTotal().getAmount()).toEqual(70776);

        });

        it("should not apply quantity discount for odd quantities", () => {
            const condition = {
                quantity: 2,
            };

            cart.add({
                product,
                condition,
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(106164);

        });


        it('should receive two or more conditions and must apply the best discount to the total', () => {
            const condition1 = {
                percentage: 30,
                minimum: 2,
            };

            const condition2 = {
                quantity: 2,
            };

            cart.add({
                product,
                condition: [condition1, condition2],
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(106164);
        });

        it('should receive two or more conditions and must apply the best discount to the total', () => {
            const condition1 = {
                percentage: 80,
                minimum: 2,
            };

            const condition2 = {
                quantity: 2,
            };

            cart.add({
                product,
                condition: [condition1, condition2],
                quantity: 5,
            });

            expect(cart.getTotal().getAmount()).toEqual(35388);
        });



    });


});