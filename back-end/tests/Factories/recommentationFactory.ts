import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export async function createRecommendation(){

    const recommendation: CreateRecommendationData = {

        name: faker.music.songName() + faker.random.alphaNumeric(),
        youtubeLink: `www.youtube.com/${faker.random.alpha()}`
    
    }

    return await prisma.recommendation.create({
        data: recommendation
    });

}