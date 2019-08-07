import config from '../../../support/config/services';
import envConfig from '../../../support/config/envs';
import describeForEuOnly from '../../../support/describeForEuOnly';
import metadataTest from './tests/metadata';
import htmlAttrsTest from './tests/htmlAttrs';
import footerTest from './tests/footer';
import bodyTest from './tests/body';

// TODO: Remove after https://github.com/bbc/simorgh/issues/2959
const serviceHasFigure = service =>
  ['arabic', 'news', 'pashto', 'persian', 'urdu'].includes(service);

const serviceHasArticlePageType = service =>
  config[service].pageTypes.articles !== undefined;

Object.keys(config)
  .filter(serviceHasArticlePageType)
  .forEach(service => {
    describe(`Article - Amp - ${service}`, () => {
      before(() => {
        cy.visit(`${config[service].pageTypes.articles}.amp`);
      });

      metadataTest(service);
      htmlAttrsTest(service);
      footerTest(service);
      bodyTest(service);

      describe('ATI', () => {
        it('should have an amp-analytics tag with the ati url', () => {
          cy.hasAmpAnalyticsAtiUrl(
            envConfig.atiUrl,
            config[service].isWorldService
              ? envConfig.atiAnalyticsWSBucket
              : '',
          );
        });
      });

      describe('Chartbeat', () => {
        if (envConfig.chartbeatEnabled) {
          it('should have chartbeat config UID', () => {
            cy.hasAmpChartbeatConfigUid();
          });
        }
      });

      describeForEuOnly('Consent Banners', () => {
        it('have correct translations', () => {
          cy.hasConsentBannerTranslations(service);
        });
      });

      it('should have AMP attribute', () => {
        cy.get('html').should('have.attr', 'amp');
      });

      // TODO - Refactor or review this. Can it be a puppeteer test?
      it('should load the AMP framework', () => {
        // .eq(2) gets the amp <script> as:
        // the first loaded is a Cypress <script>
        // the second loaded is the Schema.org metadata script
        cy.get('head script')
          .eq(2)
          .should('have.attr', 'src', 'https://cdn.ampproject.org/v0.js');

        cy.get('head script')
          .eq(3)
          .should(
            'have.attr',
            'src',
            'https://cdn.ampproject.org/v0/amp-geo-0.1.js',
          );

        cy.get('head script')
          .eq(4)
          .should(
            'have.attr',
            'src',
            'https://cdn.ampproject.org/v0/amp-consent-0.1.js',
          );

        cy.get('head script')
          .eq(5)
          .should(
            'have.attr',
            'src',
            'https://cdn.ampproject.org/v0/amp-analytics-0.1.js',
          );
      });

      it('should load the AMP body scripts', () => {
        cy.get('body script')
          .eq(0)
          .should('have.attr', 'type', 'application/json');
        cy.get('body script')
          .eq(1)
          .should('have.attr', 'type', 'application/json');
      });

      it('should have any correct amp scripts in the body and the head', () => {
        cy.get('body script')
          .its('length')
          .should('be', 2); // 1 for amp-geo + 1 for amp-consent
        cy.get('head script')
          .its('length')
          .should('be', 5); // 1 for amp.js + 1 for amp-geo + 1 for amp-consent + 1 for amp-analytics + 1 that Cypress injects into the head
      });

      it('should contain an amp-img', () => {
        if (serviceHasFigure(service)) {
          cy.get('figure')
            .eq(0)
            .should('be.visible')
            .within(() => {
              cy.get('amp-img').should('be.visible');
            });
        }
      });
    });
  });
