import envConfig from '../../../support/config/envs';
import config from '../../../support/config/services';
import appConfig from '../../../../src/app/lib/config/services';
import metadataTest from './tests/metadata';
import htmlAttrsTest from './tests/htmlAttrs';
import footerTest from './tests/footer';
import bodyTest from './tests/body';

const serviceHasArticlePageType = service =>
  config[service].pageTypes.articles !== undefined;

Object.keys(config)
  .filter(serviceHasArticlePageType)
  .forEach(service => {
    describe(`Article - Canonical - ${service}`, () => {
      before(() => {
        cy.visit(config[service].pageTypes.articles);
      });

      metadataTest(service);
      htmlAttrsTest(service);
      footerTest(service);
      bodyTest(service);

      describe(`Meta Tests`, () => {
        it('should not have an AMP attribute on the main article', () => {
          cy.get('html').should('not.have.attr', 'amp');
        });

        it('should include the ampHTML url', () => {
          cy.checkAmpHTML(
            `${window.location.origin}${config[service].pageTypes.articles}.amp`,
          );
        });
      });

      describe('ATI', () => {
        it('should have a noscript tag with an 1px image with the ati url', () => {
          cy.hasNoscriptImgAtiUrl(
            envConfig.atiUrl,
            config[service].isWorldService
              ? envConfig.atiAnalyticsWSBucket
              : '',
          );
        });
      });

      describe('Chartbeat', () => {
        if (envConfig.chartbeatEnabled) {
          it('should have a script with src value set to chartbeat source', () => {
            cy.hasScriptWithChartbeatSrc();
          });
          it('should have chartbeat config set to window object', () => {
            cy.hasGlobalChartbeatConfig();
          });
        }
      });

      describe('Consent Banners', () => {
        it('have correct translations', () => {
          cy.hasConsentBannerTranslations(service);
        });
      });

      describe('Scripts', () => {
        it('should only have expected bundle script tags', () => {
          cy.hasExpectedJsBundles(envConfig.assetOrigin, service);
        });

        it('should have 1 bundle for its service', () => {
          cy.hasOneServiceBundle(service);
        });
      });
    });
  });
