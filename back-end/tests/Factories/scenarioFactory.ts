import { prisma } from "../../src/database";
import { createRecommendation } from "./recommentationFactory";

export async function deleteAll(){
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE`
    ])
}

export async function createScenarioTwoRecommended(){
    const recommendation1  = createRecommendation();
    const recommendation2  = createRecommendation();

    return {
        recommendation1,
        recommendation2
    }
}