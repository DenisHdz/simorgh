import config from '../../../../support/config/services';
import appConfig from '../../../../../src/app/lib/config/services';
import envConfig from '../../../../support/config/envs';

export default service =>
  describe('Metadata', () => {
    it('Metadata stuff', () => {
      cy.request(`${config[service].pageTypes.articles}.json`).then(
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

          cy.checkCanonicalURL(
            `https://www.bbc.com${config[service].pageTypes.articles}`,
          );
        },
      );
    });

    it('should have a correct robot meta tag', () => {
      cy.checkMetadataContent('head meta[name="robots"]', 'noodp,noydir');
    });

    it('should have resource hints', () => {
      const resources = [
        envConfig.assetOrigin,
        'https://ichef.bbci.co.uk',
        'https://gel.files.bbci.co.uk',
      ];

      resources.forEach(resource => {
        const selector = `head link[href="${resource}"]`;
        cy.get(selector).should('have.attr', 'rel', 'preconnect');
        cy.get(selector)
          .eq(1)
          .should('have.attr', 'rel', 'dns-prefetch');
      });
    });

    it('should have the correct facebook metadata', () => {
      cy.checkFacebookMetadata(
        '100004154058350',
        '1609039196070050',
        `${appConfig[service].articleAuthor}`,
      );
    });

    it('should have the correct open graph metadata', () => {
      cy.checkOpenGraphMetadata(
        'Meghan follows the royal bridal tradition started by the Queen Mother in 1923.',
        `${appConfig[service].defaultImage}`,
        `${appConfig[service].defaultImageAltText}`,
        `${appConfig[service].locale}`,
        `${appConfig[service].defaultImageAltText}`,
        "Meghan's bouquet laid on tomb of unknown warrior",
        'article',
        `https://www.bbc.com${config[service].pageTypes.articles}`,
      );
    });

    it('should have the correct twitter metadata', () => {
      cy.checkTwitterMetadata(
        'summary_large_image',
        `${appConfig[service].twitterCreator}`,
        'Meghan follows the royal bridal tradition started by the Queen Mother in 1923.',
        `${appConfig[service].defaultImageAltText}`,
        `${appConfig[service].defaultImage}`,
        `${appConfig[service].twitterSite}`,
        "Meghan's bouquet laid on tomb of unknown warrior",
      );
    });

    it('should include mainEntityOfPage in the LinkedData', () => {
      cy.get('script[type="application/ld+json"]')
        .should('contain', 'mainEntityOfPage')
        .and('contain', 'author')
        .and('contain', 'headline');
    });

    it('should include the canonical URL', () => {
      cy.checkCanonicalURL(
        `https://www.bbc.com${config[service].pageTypes.articles}`,
      );
    });
  });
