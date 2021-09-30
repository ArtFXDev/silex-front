/* eslint-disable no-undef */
/* config-overrides.js */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react-hooks/rules-of-hooks */
const { useBabelRc, override } = require("customize-cra");

module.exports = override(useBabelRc());
