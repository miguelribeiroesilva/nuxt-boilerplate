import { faker } from '@faker-js/faker'
import { computed } from 'vue'

export const useFaker = () => {
  // User Data
  const generateUser = (withAvatar = true) => ({
    id: faker.string.uuid(),
    avatar: withAvatar ? faker.image.avatar() : undefined,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    birthDate: faker.date.birthdate(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
    },
    company: {
      name: faker.company.name(),
      role: faker.person.jobTitle(),
      department: faker.commerce.department(),
    },
    username: faker.internet.userName(),
    password: faker.internet.password(),
    registeredAt: faker.date.past(),
    lastLoginAt: faker.date.recent(),
  })

  // Product Data
  const generateProduct = (withImage = true) => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    image: withImage ? faker.image.urlLoremFlickr({ category: 'product' }) : undefined,
    category: faker.commerce.department(),
    brand: faker.company.name(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    stock: faker.number.int({ min: 0, max: 1000 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    reviews: faker.number.int({ min: 0, max: 500 }),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.commerce.productAdjective()),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  })

  // Blog Post Data
  const generateBlogPost = (withImage = true) => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    image: withImage ? faker.image.urlLoremFlickr({ category: 'nature' }) : undefined,
    excerpt: faker.lorem.paragraph(),
    author: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    category: faker.word.words(1),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.word.words(1)),
    publishedAt: faker.date.past(),
    readTime: faker.number.int({ min: 1, max: 20 }),
    comments: faker.number.int({ min: 0, max: 100 }),
    likes: faker.number.int({ min: 0, max: 1000 }),
  })

  // Company Data
  const generateCompany = (withLogo = true) => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    logo: withLogo ? faker.image.urlLoremFlickr({ category: 'business' }) : undefined,
    description: faker.company.catchPhrase(),
    industry: faker.company.buzzPhrase(),
    employees: faker.number.int({ min: 1, max: 10000 }),
    founded: faker.date.past({ years: 30 }).getFullYear(),
    website: faker.internet.url(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
    },
    social: {
      twitter: faker.internet.userName(),
      facebook: faker.internet.userName(),
      linkedin: faker.internet.userName(),
    },
  })

  // Transaction Data
  const generateTransaction = () => ({
    id: faker.string.uuid(),
    amount: faker.finance.amount(),
    currency: faker.finance.currencyCode(),
    type: faker.helpers.arrayElement(['payment', 'refund', 'deposit', 'withdrawal']),
    status: faker.helpers.arrayElement(['completed', 'pending', 'failed', 'cancelled']),
    description: faker.finance.transactionDescription(),
    merchant: faker.company.name(),
    cardType: faker.finance.creditCardIssuer(),
    cardNumber: faker.finance.creditCardNumber(),
    date: faker.date.recent(),
    category: faker.commerce.department(),
  })

  // Comment Data
  const generateComment = () => ({
    id: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    author: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    },
    rating: faker.number.int({ min: 1, max: 5 }),
    createdAt: faker.date.recent(),
    likes: faker.number.int({ min: 0, max: 100 }),
    replies: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => ({
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        author: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          avatar: faker.image.avatar(),
        },
        createdAt: faker.date.recent(),
        likes: faker.number.int({ min: 0, max: 50 }),
      })
    ),
  })

  // Notification Data
  const generateNotification = () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error']),
    title: faker.lorem.sentence(),
    message: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    read: faker.datatype.boolean(),
    icon: faker.helpers.arrayElement(['pi pi-info-circle', 'pi pi-check', 'pi pi-exclamation-triangle', 'pi pi-times-circle']),
    action: faker.helpers.maybe(() => ({
      label: faker.word.words(2),
      url: faker.internet.url(),
    })),
  })

  // Generate Multiple Items
  const generateMultiple = <T>(generator: () => T, count: number): T[] => {
    return Array.from({ length: count }, generator)
  }

  // Utility Functions
  const utilities = computed(() => ({
    randomNumber: (min: number, max: number) => faker.number.int({ min, max }),
    randomBoolean: () => faker.datatype.boolean(),
    randomDate: (options?: { years?: number, refDate?: Date }) => faker.date.past(options),
    randomArrayElement: <T>(array: T[]) => faker.helpers.arrayElement(array),
    randomArrayElements: <T>(array: T[], count?: number) => faker.helpers.arrayElements(array, count),
    maybe: <T>(callback: () => T, probability = 0.5) => faker.helpers.maybe(callback, { probability }),
  }))

  return {
    generateUser,
    generateProduct,
    generateBlogPost,
    generateCompany,
    generateTransaction,
    generateComment,
    generateNotification,
    generateMultiple,
    ...utilities.value
  }
}
