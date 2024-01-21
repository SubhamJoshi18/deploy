import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export async function createProductsWithCategories() {
    const categories = await prisma.$transaction(
        Array(10)
            .fill(null)
            .map((_, i) => {
                return prisma.productCategory.create({
                    data: {
                        category_name: faker.commerce.productAdjective(),
                    },
                })
            })
    )

    const products = Array(10)
        .fill(null)
        .map(() => {
            return prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    product_image: faker.image.url(),
                    category: {
                        connect: {
                            id: categories[
                                Math.floor(Math.random() * categories.length)
                            ].id,
                        },
                    },
                },
            })
        })

    return prisma.$transaction(products)
}

export async function createUser() {
    await prisma.user.create({
        data: {
            email: 'admin@gmail.com',
            password: await bcrypt.hash('admin', 10),
            is_admin: true,
        },
    })
    return prisma.user.create({
        data: {
            email: faker.person.fullName() + '@gmail.com',
            password: await bcrypt.hash(faker.string.uuid(), 10),
            addresses: {
                create: {
                    address_line1: faker.location.streetAddress(),
                    city: faker.location.city(),
                    postal_code: faker.location.zipCode(),
                    region: faker.location.secondaryAddress(),
                    street_number: faker.location.street(),
                },
            },
        },
    })
}
