import { prisma } from "../src/database";
import supertest from 'supertest';
import app from "../src/app.js";
import { createRecommendation } from "./Factories/recommentationFactory.js";
import { createScenarioTwoRecommended, deleteAll } from "./Factories/scenarioFactory.js";
import { faker } from "@faker-js/faker";

const agent = supertest(app);


beforeEach(async () => {
    await deleteAll();
});

describe("Recommendation", () => {

    it("when creating a new recommendation it should return 200", async () => {
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

    it("should answer with status 404 when recommendation are not found", async () => {
        const result = await agent.get("/recommendations/1");
        const status = result.status;

        expect(status).toEqual(404);
    });

    it("should answer with status 200 when recommendation are found", async () => {
        const recommendation = await createRecommendation();
        console.log(recommendation);
        
        const result = await agent.get(`/recommendations/${recommendation.id}`);
        const status = result.status;

        expect(status).toEqual(200);
    });

});
afterAll(async () => {
    await prisma.$disconnect();
});