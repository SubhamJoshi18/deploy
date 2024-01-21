import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import {
    createProductsWithCategories,
    createUser,
} from './helpers/products.helper'

const prisma = new PrismaClient()

export async function clean() {
    await prisma.orderLine.deleteMany()
    await prisma.productConfiguration.deleteMany()
    await prisma.shopOrder.deleteMany()
    await prisma.orderStatus.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
    await prisma.productItem.deleteMany()
    await prisma.variationOption.deleteMany()
    await prisma.variation.deleteMany()
    await prisma.product.deleteMany()
    await prisma.productCategory.deleteMany()
}

export function randomNumber(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sampleArray<T>(arr: Array<T>) {
    const count = randomNumber(1, arr.length - 1)

    return Array(count)
        .fill(null)
        .map(() => arr[randomNumber(0, arr.length - 1)])
}

async function seed() {
    try {
        await clean()
        const products = await createProductsWithCategories()
        const user = await createUser()

        await prisma.shopOrder.create({
            data: {
                order_total: Math.random() * 100,
                shipping_address: {
                    create: {
                        address_line1: faker.location.streetAddress(),
                        city: faker.location.city(),
                        postal_code: faker.location.zipCode(),
                        region: faker.location.secondaryAddress(),
                        street_number: faker.location.street(),
                        user_id: user.id,
                    },
                },
                order_date: new Date(),

                order_status: {
                    create: {
                        status: ['completed', 'processing', 'shipped'][
                            randomNumber(0, 2)
                        ],
                    },
                },
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                order_lines: {
                    create: sampleArray(products).map((product) => ({
                        quantity: randomNumber(1, 10),
                        price: randomNumber(1, 1000),
                        product_item: {
                            create: {
                                price: Math.ceil(
                                    Number(faker.finance.amount(1, 1000))
                                ),
                                quantity_in_stock: Math.ceil(
                                    Number(faker.finance.amount(1, 1000))
                                ),
                                SKU: `SKU-${faker.commerce.productAdjective()}-${Math.ceil(
                                    Number(faker.finance.amount(1, 100000))
                                )}`,
                                product: {
                                    connect: {
                                        id: products[
                                            Math.floor(
                                                Math.random() * products.length
                                            )
                                        ].id,
                                    },
                                },
                                configurations: {
                                    create: [
                                        {
                                            variation_option: {
                                                create: {
                                                    value: '3 gb',
                                                    variation: {
                                                        create: {
                                                            name: 'RAM',
                                                            category: {
                                                                connect: {
                                                                    id: product.category_id,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            variation_option: {
                                                create: {
                                                    value: '32 gb',
                                                    variation: {
                                                        create: {
                                                            name: 'Storage',
                                                            category: {
                                                                connect: {
                                                                    id: product.category_id,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    })),
                },
            },
            include: {
                user: {
                    include: {
                        addresses: true,
                    },
                },
                order_lines: true,
            },
        })
    } catch (error) {
        console.error('Error seeding data:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seed()
    .then(() => {
        console.log('seed complete')
    })
    .catch(() => {
        console.log('seed failed')
    })
