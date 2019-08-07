import config from '../../../../support/config/services';
import appConfig from '../../../../../src/app/lib/config/services';

export default service =>
  it('should have lang and dir attributes', () => {
    cy.request(`${config[service].pageTypes.articles}.json`).then(
      ({ body }) => {
        cy.hasHtmlLangDirAttributes({
          lang: body.metadata.passport.language,
          dir: appConfig[service].dir,
        });
      },
    );
  });
