// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
// / <reference types="cypress" />


describe('Recommendation', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('should create new recommendation successfully', () => {

    const name = faker.music.songName() + faker.random.alphaNumeric()
    cy.intercept('POST','/recommendations').as('postRecommendation');
    cy.get('#name').type(name);
    cy.get('#youtubeLink').type('https://youtu.be/nn60EqUW8Jg');
    cy.get('#newRecommendation').click();
    
    cy.wait('@postRecommendation');
    cy.request('GET', 'http://localhost:5000/recommendations').should((response) => {
      expect(response.body[0].name).to.equal(name);
    })

  });

  it('should upvote recommendation successfully', () => {
      
      cy.visit('http://localhost:3000');
      const name = faker.music.songName() + faker.random.alphaNumeric()
      const youtubeLink = 'https://youtu.be/nn60EqUW8Jg'

      cy.intercept('GET','/recommendations').as('getRecommendation');
      cy.intercept('POST','/recommendations').as('postRecommendation');
      cy.intercept('POST','**/upvote').as('upvoteRecommendation');

      cy.get('#name').type(name);
      cy.get('#youtubeLink').type(youtubeLink);
      cy.get('#newRecommendation').click();

      
      cy.wait('@postRecommendation');
      cy.request('GET', 'http://localhost:5000/recommendations')
      cy.wait('@getRecommendation');
  
      cy.get('.recommendations article #upvote').first().click();
      cy.wait('@upvoteRecommendation');

      cy.get('.recommendations article #score').first().should('have.text', ' 1');
  
  });

  it('should downvote recommendation successfully', () => {
      
    const name = faker.music.songName() + faker.random.alphaNumeric()
    const youtubeLink = 'https://youtu.be/nn60EqUW8Jg'

    cy.intercept('GET','/recommendations').as('getRecommendation');
    cy.intercept('POST','/recommendations').as('postRecommendation');
    cy.intercept('POST','**/upvote').as('upvoteRecommendation');
    cy.intercept('POST','**/downvote').as('downvoteRecommendation');
    
    cy.get('#name').type(name);
    cy.get('#youtubeLink').type(youtubeLink);
    cy.get('#newRecommendation').click();

    
    cy.wait('@postRecommendation');
    cy.request('GET', 'http://localhost:5000/recommendations')
    cy.wait('@getRecommendation');

    cy.get('.recommendations article #downvote').first().click();
    cy.wait('@downvoteRecommendation');


    cy.get('.recommendations article #score').first().should('have.text', ' -1');

  });
});
