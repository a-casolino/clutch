const clutchConfig = require('./next.config.clutch.js');

// Enable viewTransitions
clutchConfig.experimental = {
  ...clutchConfig.experimental,
  viewTransition: true,
};

module.exports = clutchConfig;
