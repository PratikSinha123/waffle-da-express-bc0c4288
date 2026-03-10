export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  price2?: number;
  priceLabel?: string;
  priceLabel2?: string;
  category: string;
  isVeg: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const addOns20: AddOn[] = [
  { id: "ao-oreo", name: "Oreo", price: 20 },
  { id: "ao-kitkat", name: "Kitkat", price: 20 },
  { id: "ao-gems", name: "Gems", price: 20 },
  { id: "ao-jimjam", name: "Jimjam", price: 20 },
  { id: "ao-caramel-syrup", name: "Caramel Syrup", price: 20 },
  { id: "ao-maple-syrup", name: "Maple Syrup", price: 20 },
];

export const addOns30: AddOn[] = [
  { id: "ao-icecream", name: "Ice Cream", price: 30 },
  { id: "ao-choco-chips", name: "Chocolate Chips", price: 30 },
  { id: "ao-nuts", name: "Assorted Nuts", price: 30 },
  { id: "ao-sprinklers", name: "Sprinklers", price: 30 },
  { id: "ao-nutella", name: "Nutella", price: 30 },
  { id: "ao-extra-choco", name: "Extra Chocolate", price: 30 },
];

export const categories = [
  "All",
  "Waffles",
  "Waffle Cakes",
  "Spiral Potatoes",
  "Hot Chocolate",
  "Ice Cream",
  "French Fries",
  "Veg Sandwich",
  "Chicken Sandwich",
  "Veg Burger",
  "Chicken Burger",
  "Maggi",
  "Garlic Bread",
  "Veg Pizza",
  "Chicken Pizza",
  "Pasta",
  "Quick Bites",
  "Tea",
  "Coffee",
  "Ice Tea",
  "Shakes",
];

export const defaultMenuItems: MenuItem[] = [
  // WAFFLES - Chocolate Blast @90
  { id: "w1", name: "Classic Chocolate", description: "Rich chocolate waffle with classic toppings", price: 90, category: "Waffles", isVeg: true },
  { id: "w2", name: "Milkyway", description: "Smooth milky chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w3", name: "Dark Temptation", description: "Intense dark chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w4", name: "Red Velvet", description: "Signature red velvet flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w5", name: "Belgian Chocolate", description: "Premium Belgian chocolate drizzle", price: 90, category: "Waffles", isVeg: true },
  { id: "w6", name: "Eat Me Now", description: "Irresistible loaded chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w7", name: "Americano", description: "Coffee-infused chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w8", name: "Red Velvet Cream Cheese", description: "Red velvet with cream cheese topping", price: 90, category: "Waffles", isVeg: true },
  { id: "w9", name: "Butterscotch Crunch", description: "Crunchy butterscotch waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w10", name: "Maple Butter", description: "Classic maple butter glazed waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w11", name: "Bubblegum", description: "Fun bubblegum flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w12", name: "Pulpy Orange", description: "Refreshing orange flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w13", name: "Chocolate Almond", description: "Chocolate waffle with crunchy almonds", price: 90, category: "Waffles", isVeg: true },
  { id: "w14", name: "Caramel Kiss", description: "Sweet caramel drizzled waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w15", name: "Na Tere Na Mera", description: "A unique blend of flavors", price: 90, category: "Waffles", isVeg: true },
  { id: "w16", name: "Nutella", description: "Loaded with creamy Nutella", price: 90, category: "Waffles", isVeg: true },
  { id: "w17", name: "Oreo Cookie", description: "Crushed Oreo cookie waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w18", name: "Cocoa Mocha", description: "Coffee meets chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w19", name: "Melody", description: "Sweet melody of chocolate", price: 90, category: "Waffles", isVeg: true },
  { id: "w20", name: "Bourbon Whisky", description: "Bourbon biscuit flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w21", name: "Kitty Katkat", description: "Crispy KitKat waffle delight", price: 90, category: "Waffles", isVeg: true },
  { id: "w22", name: "Gems Surprise", description: "Colorful gems topped waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w23", name: "Coffee Toffee", description: "Coffee and toffee fusion", price: 90, category: "Waffles", isVeg: true },
  { id: "w24", name: "Rock It Chocolate", description: "Intense rocky chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w25", name: "Munch Mania", description: "Crunchy munch bar waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w26", name: "Laila Majnu", description: "A pair of flavors in one", price: 110, category: "Waffles", isVeg: true },
  { id: "w27", name: "Dark Bourbon", description: "Dark/White/Milk chocolate bourbon", price: 90, category: "Waffles", isVeg: true },
  { id: "w38", name: "Black Choco", description: "Intense black chocolate waffle", price: 110, category: "Waffles", isVeg: true },
  { id: "w39", name: "Whiskey Chocolate", description: "Whiskey infused chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w40", name: "Mama Malai", description: "Creamy malai flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w28", name: "Pati Patni Aur Woh", description: "Triple flavor surprise waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w29", name: "Eclairs", description: "Eclairs chocolate waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w30", name: "Jimmy Jimmy", description: "Sprinkled jimmies waffle", price: 90, category: "Waffles", isVeg: true },
  // Cream Crush Waffles
  { id: "w31", name: "Blueberry Cream Crush", description: "Fresh blueberry cream waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w32", name: "Strawberry Cream Crush", description: "Strawberry cream topped waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w33", name: "Mango Cream Crush", description: "Tropical mango cream waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w34", name: "Halwai Se", description: "Indian sweet inspired waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w35", name: "Rasmalai Pistachio", description: "Rasmalai with pistachio crush", price: 90, category: "Waffles", isVeg: true },
  { id: "w36", name: "Banarsi Paan", description: "Paan flavored waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w37", name: "Mathura Peda", description: "Classic peda inspired waffle", price: 90, category: "Waffles", isVeg: true },
  { id: "w41", name: "Brownie Sundae", description: "Warm brownie with ice cream", price: 180, category: "Waffles", isVeg: true },
  { id: "w42", name: "Ice Cream Sundae", description: "Classic ice cream sundae", price: 150, category: "Waffles", isVeg: true },
  { id: "w43", name: "Kunafa Kaju", description: "Crispy kunafa with cashew filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w44", name: "Kunafa Pista", description: "Crispy kunafa with pistachio filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w45", name: "Kunafa Almond", description: "Crispy kunafa with almond filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w46", name: "Tiramisu", description: "Classic Italian tiramisu dessert", price: 140, category: "Waffles", isVeg: true },
  { id: "w47", name: "Biscoff", description: "Creamy Biscoff dessert", price: 140, category: "Waffles", isVeg: true },

  // WAFFLE CAKES
  { id: "wc1", name: "Circle of Bliss (Single)", description: "Single layer waffle cake", price: 300, category: "Waffle Cakes", isVeg: true },
  { id: "wc2", name: "Circle of Bliss (Double)", description: "Double layer waffle cake", price: 480, category: "Waffle Cakes", isVeg: true },
  { id: "wc3", name: "Chunks of Heaven (Single)", description: "Single layer chunky waffle cake", price: 330, category: "Waffle Cakes", isVeg: true },
  { id: "wc4", name: "Chunks of Heaven (Double)", description: "Double layer chunky waffle cake", price: 550, category: "Waffle Cakes", isVeg: true },
  { id: "wc5", name: "Red Velvet Love Bite (Single)", description: "Single layer red velvet cake", price: 350, category: "Waffle Cakes", isVeg: true },
  { id: "wc6", name: "Red Velvet Love Bite (Double)", description: "Double layer red velvet cake", price: 600, category: "Waffle Cakes", isVeg: true },

  // SPIRAL POTATOES
  { id: "sp1", name: "Salted Spiral", description: "Classic salted spiral potato", price: 80, category: "Spiral Potatoes", isVeg: true },
  { id: "sp2", name: "Peri Peri Spiral", description: "Spicy peri peri flavored spiral", price: 80, category: "Spiral Potatoes", isVeg: true },
  { id: "sp3", name: "Chili Limon Spiral", description: "Tangy chili lemon spiral", price: 80, category: "Spiral Potatoes", isVeg: true },
  { id: "sp4", name: "Chunky Funky Spiral", description: "Loaded chunky spiral potato", price: 80, category: "Spiral Potatoes", isVeg: true },

  // HOT CHOCOLATE
  { id: "hc1", name: "Belgian Chocolate", description: "Rich Belgian hot chocolate", price: 100, category: "Hot Chocolate", isVeg: true },
  { id: "hc2", name: "Caramel Kiss", description: "Caramel flavored hot chocolate", price: 100, category: "Hot Chocolate", isVeg: true },
  { id: "hc3", name: "Almond Bliss", description: "Almond infused hot chocolate", price: 100, category: "Hot Chocolate", isVeg: true },
  { id: "hc4", name: "Choko La Coffee", description: "Coffee meets hot chocolate", price: 100, category: "Hot Chocolate", isVeg: true },
  { id: "hc5", name: "White Rose", description: "White chocolate rose flavor", price: 100, category: "Hot Chocolate", isVeg: true },

  // ICE CREAM
  { id: "ic1", name: "Black Currant", description: "Black currant ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic2", name: "Vanilla", description: "Classic vanilla ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic3", name: "Strawberry", description: "Strawberry ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic4", name: "Butter Scotch", description: "Butterscotch ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic5", name: "Tutti Fruity", description: "Tutti fruity ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic6", name: "Chocolate Chips", description: "Choco chip ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic7", name: "American Nut", description: "American nut ice cream cone", price: 50, category: "Ice Cream", isVeg: true },
  { id: "ic8", name: "Paan Raseela", description: "Paan flavored ice cream cone", price: 50, category: "Ice Cream", isVeg: true },

  // FRENCH FRIES
  { id: "ff1", name: "Regular Fry", description: "Classic crispy french fries", price: 80, category: "French Fries", isVeg: true },
  { id: "ff2", name: "Peri Peri Fry", description: "Spicy peri peri seasoned fries", price: 100, category: "French Fries", isVeg: true },
  { id: "ff3", name: "Masala Fry", description: "Indian masala seasoned fries", price: 90, category: "French Fries", isVeg: true },
  { id: "ff4", name: "Cheese Fry", description: "Cheesy loaded french fries", price: 100, category: "French Fries", isVeg: true },

  // VEG SANDWICH
  { id: "vs1", name: "Veg Sandwich", description: "Classic vegetable sandwich", price: 80, category: "Veg Sandwich", isVeg: true },
  { id: "vs2", name: "Veg Club Sandwich", description: "Triple layered veg club sandwich", price: 120, category: "Veg Sandwich", isVeg: true },
  { id: "vs3", name: "Cheese Grilled Sandwich", description: "Melted cheese grilled sandwich", price: 90, category: "Veg Sandwich", isVeg: true },
  { id: "vs4", name: "Paneer Grilled Sandwich", description: "Paneer stuffed grilled sandwich", price: 130, category: "Veg Sandwich", isVeg: true },

  // CHICKEN SANDWICH
  { id: "cs1", name: "Chicken Club Sandwich", description: "Loaded chicken club sandwich", price: 180, category: "Chicken Sandwich", isVeg: false },
  { id: "cs2", name: "Chilli Chicken Sandwich", description: "Spicy chilli chicken sandwich", price: 150, category: "Chicken Sandwich", isVeg: false },
  { id: "cs3", name: "B.B.Q Chicken Sandwich", description: "BBQ glazed chicken sandwich", price: 150, category: "Chicken Sandwich", isVeg: false },
  { id: "cs4", name: "Tandoori Chicken Sandwich", description: "Tandoori chicken sandwich", price: 150, category: "Chicken Sandwich", isVeg: false },

  // VEG BURGER
  { id: "vb1", name: "Aloo Tikki Burger", description: "Crispy aloo tikki patty burger", price: 65, category: "Veg Burger", isVeg: true },
  { id: "vb2", name: "Veg Cheese Burger", description: "Veg patty with melted cheese", price: 90, category: "Veg Burger", isVeg: true },
  { id: "vb3", name: "Paneer Cheese Burger", description: "Paneer patty with cheese", price: 110, category: "Veg Burger", isVeg: true },
  { id: "vb4", name: "Veg Burger", description: "Classic vegetable burger", price: 75, category: "Veg Burger", isVeg: true },

  // CHICKEN BURGER
  { id: "cb1", name: "Chicken Burger", description: "Classic chicken patty burger", price: 110, category: "Chicken Burger", isVeg: false },
  { id: "cb2", name: "Jumbo Chicken Burger", description: "Extra large chicken burger", price: 150, category: "Chicken Burger", isVeg: false },

  // MAGGI
  { id: "mg1", name: "Plain Maggi", description: "Classic plain Maggi noodles", price: 50, category: "Maggi", isVeg: true },
  { id: "mg2", name: "Veg Maggi", description: "Maggi with fresh vegetables", price: 70, category: "Maggi", isVeg: true },
  { id: "mg3", name: "Cheese Butter Maggi", description: "Maggi with cheese and butter", price: 80, category: "Maggi", isVeg: true },

  // GARLIC BREAD
  { id: "gb1", name: "Plain Garlic Bread", description: "Classic garlic butter bread", price: 50, category: "Garlic Bread", isVeg: true },
  { id: "gb2", name: "Cheese Garlic Bread", description: "Cheesy garlic bread", price: 75, category: "Garlic Bread", isVeg: true },
  { id: "gb3", name: "Peri Peri Garlic Bread", description: "Spicy peri peri garlic bread", price: 80, category: "Garlic Bread", isVeg: true },
  { id: "gb4", name: "Mexican Garlic Bread", description: "Mexican style garlic bread", price: 80, category: "Garlic Bread", isVeg: true },
  { id: "gb5", name: "Single Topping Garlic Bread", description: "Paneer or corn topping", price: 80, category: "Garlic Bread", isVeg: true },
  { id: "gb6", name: "Multi Cheese Garlic Bread", description: "Multiple cheese garlic bread", price: 90, category: "Garlic Bread", isVeg: true },

  // VEG PIZZA
  { id: "vp1", name: "Margherita", description: "Classic margherita pizza", price: 90, price2: 160, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp2", name: "Classic Farm House", description: "Farm fresh veggie pizza", price: 100, price2: 180, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp3", name: "Multi Cheese Pizza", description: "Loaded with multiple cheeses", price: 110, price2: 220, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp4", name: "Paneer Pizza", description: "Paneer topped pizza", price: 120, price2: 230, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp5", name: "Mexican Pizza", description: "Mexican spiced pizza", price: 120, price2: 220, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp6", name: "B.B.Q. Pizza", description: "BBQ sauce pizza", price: 120, price2: 210, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },
  { id: "vp7", name: "Single Topping Pizza", description: "Choose your topping", price: 95, price2: 190, priceLabel: "Regular", priceLabel2: "Large", category: "Veg Pizza", isVeg: true },

  // CHICKEN PIZZA
  { id: "cp1", name: "Chicken Pizza", description: "Classic chicken pizza", price: 140, price2: 250, priceLabel: "Regular", priceLabel2: "Large", category: "Chicken Pizza", isVeg: false },
  { id: "cp2", name: "B.B.Q. Chicken Pizza", description: "BBQ chicken pizza", price: 150, price2: 260, priceLabel: "Regular", priceLabel2: "Large", category: "Chicken Pizza", isVeg: false },
  { id: "cp3", name: "Chilli Chicken Pizza", description: "Spicy chilli chicken pizza", price: 160, price2: 270, priceLabel: "Regular", priceLabel2: "Large", category: "Chicken Pizza", isVeg: false },
  { id: "cp4", name: "Tandoori Chicken Pizza", description: "Tandoori chicken pizza", price: 160, price2: 280, priceLabel: "Regular", priceLabel2: "Large", category: "Chicken Pizza", isVeg: false },

  // PASTA
  { id: "pa1", name: "White Sauce Pasta", description: "Creamy white sauce pasta", price: 160, category: "Pasta", isVeg: true },
  { id: "pa2", name: "Red Sauce Pasta", description: "Tangy red sauce pasta", price: 150, category: "Pasta", isVeg: true },
  { id: "pa3", name: "Pink Sauce Pasta", description: "Mixed pink sauce pasta", price: 180, category: "Pasta", isVeg: true },

  // QUICK BITES
  { id: "qb1", name: "Chicken Wings (3 Pcs)", description: "Crispy chicken wings", price: 150, category: "Quick Bites", isVeg: false },
  { id: "qb2", name: "Chicken Wings (6 Pcs)", description: "Crispy chicken wings", price: 250, category: "Quick Bites", isVeg: false },
  { id: "qb3", name: "Chicken Nuggets (4 Pcs)", description: "Golden chicken nuggets", price: 100, category: "Quick Bites", isVeg: false },
  { id: "qb4", name: "Chicken Nuggets (8 Pcs)", description: "Golden chicken nuggets", price: 150, category: "Quick Bites", isVeg: false },
  { id: "qb5", name: "Cheese Balls (10 Pcs)", description: "Crispy cheese balls", price: 100, category: "Quick Bites", isVeg: true },
  { id: "qb6", name: "Momos (8 Pcs)", description: "Steamed momos", price: 90, category: "Quick Bites", isVeg: true },
  { id: "qb7", name: "Cheese Fingers (8 Pcs)", description: "Crispy cheese fingers", price: 100, category: "Quick Bites", isVeg: true },
  { id: "qb8", name: "Kurkure Momos (8 Pcs)", description: "Crunchy kurkure momos", price: 100, category: "Quick Bites", isVeg: true },
  { id: "w41", name: "Brownie Sundae", description: "Warm brownie with ice cream", price: 180, category: "Waffles", isVeg: true },
  { id: "w42", name: "Ice Cream Sundae", description: "Classic ice cream sundae", price: 150, category: "Waffles", isVeg: true },
  { id: "w43", name: "Kunafa Kaju", description: "Crispy kunafa with cashew filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w44", name: "Kunafa Pista", description: "Crispy kunafa with pistachio filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w45", name: "Kunafa Almond", description: "Crispy kunafa with almond filling", price: 140, category: "Waffles", isVeg: true },
  { id: "w46", name: "Tiramisu", description: "Classic Italian tiramisu dessert", price: 140, category: "Waffles", isVeg: true },
  { id: "w47", name: "Biscoff", description: "Creamy Biscoff dessert", price: 140, category: "Waffles", isVeg: true },

  // TEA
  { id: "te1", name: "Elaichi Tea", description: "Cardamom flavored tea", price: 30, category: "Tea", isVeg: true },
  { id: "te2", name: "Masala Tea", description: "Spiced masala chai", price: 30, category: "Tea", isVeg: true },
  { id: "te3", name: "Ginger Tea", description: "Fresh ginger tea", price: 30, category: "Tea", isVeg: true },
  { id: "te4", name: "Regular Tea", description: "Classic regular tea", price: 20, category: "Tea", isVeg: true },

  // COFFEE
  { id: "co1", name: "Plain Coffee", description: "Simple brewed coffee", price: 40, category: "Coffee", isVeg: true },
  { id: "co2", name: "Black Coffee", description: "Strong black coffee", price: 30, category: "Coffee", isVeg: true },
  { id: "co3", name: "Café Latte", description: "Smooth café latte", price: 50, category: "Coffee", isVeg: true },
  { id: "co4", name: "Café Mocha", description: "Chocolate café mocha", price: 50, category: "Coffee", isVeg: true },
  { id: "co5", name: "Cappuccino", description: "Frothy cappuccino", price: 60, category: "Coffee", isVeg: true },

  // ICE TEA
  { id: "it1", name: "Lemon Ice Tea", description: "Refreshing lemon iced tea", price: 100, category: "Ice Tea", isVeg: true },
  { id: "it2", name: "Peach Ice Tea", description: "Sweet peach iced tea", price: 100, category: "Ice Tea", isVeg: true },
  { id: "it3", name: "Watermelon Ice Tea", description: "Cool watermelon iced tea", price: 120, category: "Ice Tea", isVeg: true },
  { id: "it4", name: "Mojito", description: "Classic refreshing mojito", price: 80, category: "Ice Tea", isVeg: true },
  { id: "it5", name: "Cool Blue", description: "Blue curacao cooler", price: 100, category: "Ice Tea", isVeg: true },
  { id: "it6", name: "Watermelon Mojito", description: "Watermelon mint mojito", price: 120, category: "Ice Tea", isVeg: true },

  // SHAKES
  { id: "sh1", name: "Vanilla Shake", description: "Classic vanilla milkshake", price: 100, category: "Shakes", isVeg: true },
  { id: "sh2", name: "Cold Coffee", description: "Iced cold coffee", price: 90, category: "Shakes", isVeg: true },
  { id: "sh3", name: "Chocolate Shake", description: "Rich chocolate milkshake", price: 120, category: "Shakes", isVeg: true },
  { id: "sh4", name: "Oreo Shake", description: "Creamy Oreo milkshake", price: 120, category: "Shakes", isVeg: true },
  { id: "sh5", name: "Kit Kat Shake", description: "KitKat blended milkshake", price: 120, category: "Shakes", isVeg: true },
  { id: "sh6", name: "Banana Shake", description: "Fresh banana milkshake", price: 80, category: "Shakes", isVeg: true },
  { id: "sh7", name: "Mango Shake", description: "Tropical mango milkshake", price: 90, category: "Shakes", isVeg: true },
  { id: "sh8", name: "Strawberry Shake", description: "Sweet strawberry milkshake", price: 90, category: "Shakes", isVeg: true },
  { id: "sh9", name: "Cold Coffee With Ice Cream", description: "Cold coffee topped with ice cream", price: 120, category: "Shakes", isVeg: true },
];
