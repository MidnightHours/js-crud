// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
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
//=================================================================

// router.get Створює нам один ентпоїнт

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
    info: 'Успішне виконання дії',
    description: 'Товар був успішно доданий',
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
      info: 'Помилка',
      description: 'Не вдалося додати товар',
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
      info: 'Успішне виконання дії',
      description: 'Товар було успішно відредаговано',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка:',
      description: ' Товар з таким ID не знайдено',
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
      info: 'Успішне виконання дії',
      description: 'Товар був успішно видалений',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка:',
      description: ' Товар з таким ID не знайдено',
    })
  }
})

//================================================================
// Підключаємо роутер до бек-енду
module.exports = router
