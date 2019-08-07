import appConfig from '../../../../../src/app/lib/config/services';

export default service =>
  describe('Footer Tests', () => {
    it('should render the BBC News branding', () => {
      cy.get('footer a')
        .eq(0)
        .should(
          'contain',
          appConfig[service].serviceLocalizedName !== undefined
            ? `${appConfig[service].product}, ${appConfig[service].serviceLocalizedName}`
            : appConfig[service].product,
        );
    });

    it('should have working links', () => {
      cy.get('footer ul').within(() =>
        appConfig[service].footer.links.forEach(({ href }, key) =>
          cy.checkLinks(key, href),
        ),
      );
    });

    it('should contain copyright text', () => {
      cy.get('footer p').should(
        'contain',
        `© ${new Date().getFullYear()} ${
          appConfig[service].footer.copyrightText
        }`,
      );
    });
    it('should contain a link in the copyright text', () => {
      cy.get('footer p')
        .children('a')
        .should('have.attr', 'href')
        .and('contain', appConfig[service].footer.externalLink.href);
    });
  });
