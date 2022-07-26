import { prisma } from "../src/database";
import { faker } from "@faker-js/faker";
import supertest from 'supertest';
import app from "../src/app.js";
import { log } from "console";


const test = {

    name: faker.music.songName(),
    youtubeLink: `www.youtube.com/${faker.random.alpha()}`

}

console.log(test);

beforeEach(async () => {

});
describe("testPerTeachers", () => {
    it("when creating a new recommendation it should return 200", async () => {

        const result = await supertest(app).post("/recomendations").send(test);
        console.log(result.error);
        
        
        const status = result.status;

        expect(status).toEqual(200);
    }
);

});
afterAll(async () => {
    await prisma.$disconnect();
});