import {Component, OnInit} from '@angular/core';

interface PizzaSize {
  id: number;
  label: string;
  price: number;
}

interface Topping {
  id: number;
  label: string;
  price: number;
  countAs?: number;
}

interface Offer {
  label: string;
  sizeId: number;
  toppingCount: number;
  price?: number;
  discount?: number;
  totalCount?: number;
}

interface PizzaOrderBySize {
  [sizeId: number]: number[];
}

interface PizzaPriceBySize {
  [sizeId: number]: number;
}

interface OfferBySize {
  [sizeId: number]: Offer;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  pizzaSizes: PizzaSize[] = [
    {
      id: 1,
      label: 'Small',
      price: 5,
    },
    {
      id: 2,
      label: 'Medium',
      price: 7,
    },
    {
      id: 3,
      label: 'Large',
      price: 8,
    },
    {
      id: 4,
      label: 'Extra Large',
      price: 9,
    },
  ];

  vegToppings: Topping[] = [
    {
      id: 1,
      label: 'Tomatoes',
      price: 1,
    },
    {
      id: 2,
      label: 'Onions',
      price: 0.5,
    },
    {
      id: 3,
      label: 'Bell pepper',
      price: 1,
    },
    {
      id: 4,
      label: 'Mushrooms',
      price: 1.2,
    },
    {
      id: 5,
      label: 'Pineapple',
      price: 0.75,
    },
  ];

  nonVegToppings: Topping[] = [
    {
      id: 6,
      label: 'Sausage',
      price: 1,
    },
    {
      id: 7,
      label: 'Pepperoni',
      price: 2,
      countAs: 2,
    },
    {
      id: 8,
      label: 'Barbecue chicken',
      price: 3,
      countAs: 2,
    },
  ];

  offers: Offer[] = [
    {
      label: 'Offer 1',
      sizeId: 2,
      toppingCount: 2,
      price: 5,
    },
    {
      label: 'Offer 2',
      sizeId: 2,
      toppingCount: 4,
      price: 9,
      totalCount: 2,
    },
    {
      label: 'Offer 3',
      sizeId: 3,
      toppingCount: 4,
      discount: 50,
    },
  ];

  pizzaOrderBySize: PizzaOrderBySize = {};

  pizzaPriceBySize: PizzaPriceBySize = {};

  matchedOfferBySize: OfferBySize = {};

  offerPriceBySize: PizzaPriceBySize = {};

  ngOnInit(): void {
    this.initOrdersAndPrices();
  }

  private initOrdersAndPrices() {
    for (const pizzaSize of this.pizzaSizes) {
      this.pizzaOrderBySize[pizzaSize.id] = [];
      this.pizzaPriceBySize[pizzaSize.id] = 0;
    }
  }

  private calcPizzaPrice() {
    this.matchedOfferBySize = {};
    this.offerPriceBySize = {};

    for (const pizzaSize of this.pizzaSizes) {
      this.pizzaPriceBySize[pizzaSize.id] = 0;
      let toppingCount = 0;

      for (const orderToppingId of this.pizzaOrderBySize[pizzaSize.id]) {
        const orderTopping = this.vegToppings.concat(this.nonVegToppings).find(topping => topping.id === orderToppingId);

        if (orderTopping) {
          this.pizzaPriceBySize[pizzaSize.id] += orderTopping.price;
          toppingCount += orderTopping.countAs ?? 1;
        }
      }

      if (this.pizzaOrderBySize[pizzaSize.id].length > 0) {
        this.pizzaPriceBySize[pizzaSize.id] += pizzaSize.price;
      }

      for (const offer of this.offers) {
        if (offer.sizeId === pizzaSize.id) {
          if (toppingCount === offer.toppingCount) {
            this.matchedOfferBySize[pizzaSize.id] = offer;
            if (offer.discount) {
              this.offerPriceBySize[pizzaSize.id] = this.pizzaPriceBySize[pizzaSize.id] * offer.discount / 100;
            } else {
              this.offerPriceBySize[pizzaSize.id] = offer.price ?? 0;
            }

            break;
          }
        }
      }
    }
  }

  handleClick(toppingId: number, pizzaSizeId: number) {
    const toppingIndex = this.pizzaOrderBySize[pizzaSizeId].findIndex(id => toppingId === id);
    if (toppingIndex === -1) {
      this.pizzaOrderBySize[pizzaSizeId].push(toppingId);
    } else {
      this.pizzaOrderBySize[pizzaSizeId].splice(toppingIndex, 1);
    }

    this.calcPizzaPrice();
  }
}
