import { prisma } from "../../src/database"
import { createRecommendation } from "./recommentationFactory"

export async function deleteAll() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE`,
  ])
}

export async function createScenarioTwoRecommended() {
  const recommendation1 = await createRecommendation()
  const recommendation2 = await createRecommendation()

  return {
    recommendation1,
    recommendation2,
  }
}

export async function createScenarioRamdomRecommended() {
  const amount = Math.floor(Math.random() * 20)
  for (let index = 0; index < amount; index++) {
    await createRecommendation()
  }

  return amount
}
