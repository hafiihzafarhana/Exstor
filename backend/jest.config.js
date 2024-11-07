// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'], // Menambahkan folder test di luar src
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  }
};
