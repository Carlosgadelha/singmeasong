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


  it('should return a list of recommendations when clicking top', () => {
    let length = 0;
    cy.get('.recommendations article').then((recommendations) => {
        length = recommendations.length;
    })

    cy.get('#top').click();
    cy.get('.recommendations article').then((recommendations) => {

      if (length >= 10) expect(recommendations).to.have.length(10);
      else expect(recommendations).to.have.length(length);
      
    })
  });

  it('should return a recommendation when clicking random', () => {
    cy.get('#random').click();
    cy.get('.recommendations article').should('have.length', 1);
  });

  it('should return to home click on home', () => {
    cy.get('#home').click();
    cy.url().should('eq', 'http://localhost:3000/');
  })

});
