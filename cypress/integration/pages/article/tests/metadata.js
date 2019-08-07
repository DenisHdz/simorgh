export default path =>
  it('Metadata', () => {
    cy.request(`${path}.json`).then(
      ({ body }) => {
        cy.get('meta[name="description"]').should(
          'have.attr',
          'content',
          body.promo.summary || body.promo.headlines.seoHeadline,
        );
        cy.get('meta[name="og:title"]').should(
          'have.attr',
          'content',
          body.promo.headlines.seoHeadline,
        );
        cy.get('meta[name="og:type"]').should(
          'have.attr',
          'content',
          body.metadata.type,
        );
        cy.get('meta[name="article:published_time"]').should(
          'have.attr',
          'content',
          new Date(body.metadata.firstPublished).toISOString(),
        );
        cy.get('meta[name="article:modified_time"]').should(
          'have.attr',
          'content',
          new Date(body.metadata.lastPublished).toISOString(),
        );

        cy.get('html').should(
          'have.attr',
          'lang',
          body.metadata.passport.language,
        );
      },
    );
  });
