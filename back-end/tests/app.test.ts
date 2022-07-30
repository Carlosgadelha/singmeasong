import { prisma } from "../src/database";
import supertest from 'supertest';
import app from "../src/app.js";
import { createRecommendation } from "./Factories/recommentationFactory.js";
import { createScenarioRamdomRecommended, createScenarioTwoRecommended, deleteAll } from "./Factories/scenarioFactory.js";
import { faker } from "@faker-js/faker";

const agent = supertest(app);

beforeEach(async () => {
    await deleteAll();
});

describe("Recommendation", () => {

    it("should answer with status 200 when creating a new recommendation", async () => {
        const recommendation = {

            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/${faker.random.alpha()}`
        
        }

        const result = await agent.post("/recommendations").send(recommendation);
        const status = result.status;

        expect(status).toEqual(201);
    });

    it("should answer with status 422 when recommendation are invalid", async () => {

        const recommendation = {  name: faker.music.songName(), youtubeLink: ""}
        const result = await agent.post("/recommendations").send(recommendation);
        const status = result.status;

        expect(status).toEqual(422);
    });

    it("should return recommendations", async () => {
        await createScenarioTwoRecommended();
        const result = await agent.get("/recommendations");
        
        expect(result.body.length).toEqual(2);
    });

    it("should return a random recommendation", async () => {

        await createScenarioTwoRecommended();
        const result = await agent.get("/recommendations/random");
        
        expect(result.body.id).toEqual(expect.any(Number));
    });

    it("should return a top recommendation", async () => {
            
            const randon  = await createScenarioRamdomRecommended();
            const amount = Math.floor(Math.random() * randon);
            const result = await agent.get(`/recommendations/top/${amount}`);
            expect(result.body.length).toEqual(amount);
    });

    it("should answer with status 404 when recommendation are not found", async () => {
        const result = await agent.get("/recommendations/1");
        const status = result.status;

        expect(status).toEqual(404);
    });

    it("should answer with status 200 when recommendation are found", async () => {
        const recommendation = await createRecommendation();
        
        const result = await agent.get(`/recommendations/${recommendation.id}`);
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("should return status 200 upvote recommendation", async () => {
        const recommendation = await createRecommendation();
        const result = await agent.post(`/recommendations/${recommendation.id}/upvote`);
        
        const status = result.status;
        
        expect(status).toEqual(200);
    });

    it("should return status 200 downvote recommendation", async () => {
        const recommendation = await createRecommendation();
        const result = await agent.post(`/recommendations/${recommendation.id}/downvote`);
        
        const status = result.status;
        
        expect(status).toEqual(200);
    });

});
afterAll(async () => {
    await prisma.$disconnect();
});