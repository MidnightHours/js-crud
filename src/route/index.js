// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
// MAIN PAGE======================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

//===================================================================
//===================================================================

//===================================================================
// USER===============================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, { data }) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

//=================================================================
router.get('/user-index', function (req, res) {
  const list = User.getList()

  res.render('user-index', {
    style: 'user-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
//====================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створений',
  })
})
//=============================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
})
//================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Email адреса оновлена'
      : 'Сталася помилка',
  })
})

//================================================================
//================================================================

//================================================================
// PRODUCT==========================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, { data }) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================
router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})
//================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    theme: 'light',
    data: {
      info: 'Успішне виконання дії',
      description: 'Товар був успішно доданий',
      backLink: '/product-list',
    },
  })
})
//===============================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
//==============================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  const list = Product.getList()

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        product,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Помилка',
        description: 'Не вдалося додати товар',
        backLink: '/product-list',
      },
    })
  }
})
//===============================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const product = Product.getById(Number(id))

  if (product) {
    Product.update(product, {
      name,
      price,
      description,
    })

    res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Успішне виконання дії',
        description: 'Товар було успішно відредаговано',
        backLink: '/product-list',
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Помилка:',
        description: ' Товар з таким ID не знайдено',
        backLink: '/product-list',
      },
    })
  }
})
//=============================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const deleted = Product.deleteById(Number(id))
  if (deleted) {
    res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Успішне виконання дії',
        description: 'Товар був успішно видалений',
        backLink: '/product-list',
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Помилка:',
        description: ' Товар з таким ID не знайдено',
        backLink: '/product-list',
      },
    })
  }
})

//================================================================
//================================================================

//================================================================
// PURCHASE=======================================================

class PurchaseProduct {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++PurchaseProduct.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newPurchaseProduct = new PurchaseProduct(...data)

    this.#list.push(newPurchaseProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

PurchaseProduct.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  27000,
  10,
)

PurchaseProduct.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{ id: 2, text: `Топ продажів` }],
  17000,
  10,
)

PurchaseProduct.add(
  `https://picsum.photos/200/300`,
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 1, text: `Готовий до відправки` }],
  113000,
  10,
)

PurchaseProduct.add(
  `https://picsum.photos/200/300`,
  `Компьютер Cobra Advanced I14F.16.H1S4.166S.6368`,
  `Intel Core i5 10400F / Gigabyte H470M / Iridium X RAM 16ГБ / HDD 1ТБ + SSD 480ГБ / GamingPro GeForce GTX 1660 Super 6ГБ /AeroCool Hexform 500W`,
  [{ id: 1, text: `Готовий до відправки` }],
  56000,
  10,
)

PurchaseProduct.add(
  `https://picsum.photos/200/300`,
  `Компьютер Lenovo IdeaCentre G5 Gaming 14IOB6 (90RE002ERS)`,
  `Intel Core i5-10400F (6 ядер / 12 потоков) / Intel B560 / 16GB DDR4 / 256GB SSD M.2 NVMe + 1TB HDD / GeForce GTX 1650 SUPER 4GB GDDR6 / Wi-Fi`,
  [
    { id: 1, text: `Готовий до відправки` },
    { id: 2, text: `Топ продажів` },
  ],
  13000,
  10,
)

PurchaseProduct.add(
  `https://picsum.photos/200/300`,
  `Компьютер ARTLINE Gaming X39 (X39v79)`,
  `Intel Core i5-11400F (2.6 - 4.4 ГГц) / RAM 32 ГБ / SSD 1 ТБ / nVidia GeForce RTX 4060, 8 ГБ / LAN / Без ОД / Без ОС`,
  [{ id: 1, text: `Готовий до відправки` }],
  76000,
  10,
)
//================================================================

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static update = (
    purchase,
    { firstname, lastname, phone, email },
  ) => {
    if (firstname) {
      purchase.firstname = firstname
    }
    if (lastname) {
      purchase.lastname = lastname
    }
    if (phone) {
      purchase.phone = phone
    }
    if (email) {
      purchase.email = email
    }
  }
}
//================================================================

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add(`NEW2023`, 0.9)
Promocode.add(`DISCOUNT2023`, 0.5)
Promocode.add(`SALE2023`, 0.75)

//================================================================

router.get('/purchase-index', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      list: PurchaseProduct.getList(),
    },
  })
})
//================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: PurchaseProduct.getRandomList(id),
      product: PurchaseProduct.getById(id),
    },
  })
})
//================================================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка:',
        description: 'Некоректна кількість товару',
        backLink: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = PurchaseProduct.getById(id)

  if (product.amount < 1) {
    {
      return res.render('alert', {
        style: 'alert',
        theme: 'light',

        data: {
          info: 'Помилка',
          description:
            'Таої кількості товару немає в начвності',
          backLink: `/purchase-product?id=${id}`,
        },
      })
    }
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE

  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
//================================================================
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = PurchaseProduct.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка',
        description: 'Товар не знайдено',
        backLink: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка',
        description: 'Товару немає в потрібній кількості',
        backLink: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка',
        description: 'Некоректні дані',
        backLink: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка',
        description: "Заповніть обов'язкові поля",
        backLink: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    theme: 'light',

    data: {
      info: 'Успішно',
      description: 'Замовлення створено',
      backLink: `/purchase-list`,
    },
  })
})
//================================================================
router.get('/purchase-list', function (req, res) {
  const purchasesData = Purchase.getList().map(
    (purchase) => {
      return {
        id: purchase.id,
        productName: purchase.product.title,
        totalPrice: purchase.totalPrice,
        bonus: purchase.bonus,
      }
    },
  )

  res.render('purchase-list', {
    style: 'purchase-list',

    data: {
      purchases: purchasesData,
    },
  })
})
//================================================================
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  if (!purchase) {
    return res.render('alert', {
      style: 'alert',
      theme: 'light',
      data: {
        info: 'Помилка',
        description: 'Замовлення не знайдено',
        backLink: '/purchase-list',
      },
    })
  }

  const purchaseData = {
    id: purchase.id,
    firstname: purchase.firstname,
    lastname: purchase.lastname,
    phone: purchase.phone,
    email: purchase.email,
    productName: purchase.product.title,
    comment: purchase.comment,
    productPrice: purchase.productPrice,
    deliveryPrice: purchase.deliveryPrice,
    totalPrice: purchase.totalPrice,
    bonus: purchase.bonus,
  }

  res.render('purchase-info', {
    style: 'purchase-info',

    data: {
      purchase: purchaseData,
    },
  })
})
//================================================================
router.get('/purchase-edit', function (req, res) {
  const { id } = req.query

  const purchase = Purchase.getById(Number(id))

  if (purchase) {
    res.render('purchase-edit', {
      style: 'purchase-edit',
      data: {
        purchase,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка',
        description: 'Не вдалося змінити дані',
        backLink: '/purchase-list',
      },
    })
  }
})
//===============================================================
router.post('/purchase-edit', function (req, res) {
  const { id, firstname, lastname, phone, email } = req.body

  const purchase = Purchase.getById(Number(id))
  console.log('Data sheck')

  console.log(id, firstname)

  if (purchase) {
    Purchase.update(purchase, {
      firstname,
      lastname,
      phone,
      email,
    })

    console.log('Data sheck')

    console.log(id, firstname)

    res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Успішне виконання дії',
        description:
          'Замовлення було успішно відредаговано',
        backLink: '/purchase-list',
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      theme: 'light',

      data: {
        info: 'Помилка:',
        description: ' Замовлення з таким ID не знайдено',
        backLink: '/purchase-list',
      },
    })
  }
})
//=============================================================
//================================================================

//================================================================
// SPOTIFY========================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }
}

Track.create(
  'Інь Ян',
  'MONATIK і ROXOLANA',
  `https://picsum.photos/100/100`,
)

Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez і Rauw Alejandro',
  `https://picsum.photos/100/100`,
)

Track.create(
  'Shameless',
  'Camila Cabello ',
  `https://picsum.photos/100/100`,
)

Track.create(
  'DÁKITI',
  'BAD BUNNY і JHAY',
  `https://picsum.photos/100/100`,
)

Track.create(
  '11 PM',
  'Maluma',
  `https://picsum.photos/100/100`,
)

Track.create(
  'Інша любов',
  'Enleo',
  `https://picsum.photos/100/100`,
)

console.log(Track.getList())

//=================================================================================

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = `https://picsum.photos/300/300`
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random)
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrackById(trackId) {
    const track = Track.getList().find(
      (t) => t.id === trackId,
    )

    if (track) {
      this.tracks.push(track)
    }
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

//================================================================
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    theme: 'dark',
  })
})
//================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',
    theme: 'dark',

    data: {
      isMix,
    },
  })
})
//======== ======================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      theme: 'dark',

      data: {
        info: 'Помилка',
        description: 'Введіть назву плейліста',
        backLink: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    theme: 'dark',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//===============================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      theme: 'dark',

      data: {
        info: 'Помилка',
        description: 'Плейліст не знайдено',
        backLink: '/spotify-choose',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    theme: 'dark',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//===============================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      theme: 'dark',

      data: {
        info: 'Помилка',
        description: 'Плейліст не знайдено',
        backLink: '/spotify-playlist?id=${playlistId}',
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    theme: 'dark',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//================================================================
router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    theme: 'dark',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})
//================================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      theme: 'dark',

      data: {
        info: 'Помилка',
        description: 'Плейліст не знайдено',
        backLink: '/spotify-playlist?id=${playlistId}',
      },
    })
  }

  playlist.addTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    theme: 'dark',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//================================================================
router.get('/spotify-index', function (req, res) {
  res.render('spotify-index', {
    style: 'spotify-index',
    theme: 'dark',

    playlists: Playlist.getList(),
  })
})
//================================================================
router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    theme: 'dark',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
//================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    theme: 'dark',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
//================================================================
// Підключаємо роутер до бек-енду
module.exports = router
