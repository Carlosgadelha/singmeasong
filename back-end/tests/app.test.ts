import { prisma } from "../src/database";
import { faker } from "@faker-js/faker";
import supertest from 'supertest';
import app from "../src/app.js";
import { log } from "console";


const test = {

    name: faker.music.songName(),
    youtubeLink: `www.youtube.com/${faker.random.alpha()}`

}

beforeEach(async () => {

});
describe("Recommendation", () => {
    it("when creating a new recommendation it should return 200", async () => {

        const result = await supertest(app).post("/recommendations").send(test);
        const status = result.status;

        expect(status).toEqual(201);
    }
);

});
afterAll(async () => {
    await prisma.$disconnect();
});